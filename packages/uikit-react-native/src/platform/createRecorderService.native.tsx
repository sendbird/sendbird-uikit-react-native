import { Platform } from 'react-native';
import * as RNAudioRecorder from 'react-native-audio-recorder-player';
import * as Permissions from 'react-native-permissions';
import { Permission } from 'react-native-permissions/src/types';

import { matchesOneOf, sleep } from '@sendbird/uikit-utils';

import VoiceMessageConfig from '../libs/VoiceMessageConfig';
import nativePermissionGranted from '../utils/nativePermissionGranted';
import type { RecorderServiceInterface, Unsubscribe } from './types';

type RecordingListener = Parameters<RecorderServiceInterface['addRecordingListener']>[number];
type StateListener = Parameters<RecorderServiceInterface['addStateListener']>[number];
type Modules = {
  audioRecorderModule: typeof RNAudioRecorder;
  permissionModule: typeof Permissions;
};
const createNativeRecorderService = ({ audioRecorderModule, permissionModule }: Modules): RecorderServiceInterface => {
  const module = new audioRecorderModule.default();

  class VoiceRecorder implements RecorderServiceInterface {
    public uri: RecorderServiceInterface['uri'] = undefined;
    public state: RecorderServiceInterface['state'] = 'idle';
    public options: RecorderServiceInterface['options'] = {
      minDuration: VoiceMessageConfig.DEFAULT.RECORDER.MIN_DURATION,
      maxDuration: VoiceMessageConfig.DEFAULT.RECORDER.MAX_DURATION,
      extension: VoiceMessageConfig.DEFAULT.RECORDER.EXTENSION,
    };

    // NOTE: In Android, even when startRecorder() is awaited, if stop() is executed immediately afterward, an error occurs
    private _recordStartedAt = 0;
    private _getRecorderStopSafeBuffer = () => {
      const minWaitingTime = 500;
      const elapsedTime = Date.now() - this._recordStartedAt;
      if (elapsedTime > minWaitingTime) return 0;
      else return minWaitingTime - elapsedTime;
    };

    private readonly recordingSubscribers = new Set<RecordingListener>();
    private readonly stateSubscribers = new Set<StateListener>();
    private readonly audioSettings = {
      sampleRate: VoiceMessageConfig.DEFAULT.RECORDER.SAMPLE_RATE,
      bitRate: VoiceMessageConfig.DEFAULT.RECORDER.BIT_RATE,
      audioChannels: VoiceMessageConfig.DEFAULT.RECORDER.CHANNELS,
      // encoding: mpeg4_aac
    };
    private readonly audioOptions = Platform.select({
      android: {
        AudioEncodingBitRateAndroid: this.audioSettings.bitRate,
        AudioChannelsAndroid: this.audioSettings.audioChannels,
        AudioSamplingRateAndroid: this.audioSettings.sampleRate,
        AudioEncoderAndroid: audioRecorderModule.AudioEncoderAndroidType.AAC,
        OutputFormatAndroid: audioRecorderModule.OutputFormatAndroidType.MPEG_4,
        AudioSourceAndroid: audioRecorderModule.AudioSourceAndroidType.VOICE_RECOGNITION,
      },
      ios: {
        AVEncoderBitRateKeyIOS: this.audioSettings.bitRate,
        AVNumberOfChannelsKeyIOS: this.audioSettings.audioChannels,
        AVSampleRateKeyIOS: this.audioSettings.sampleRate,
        AVFormatIDKeyIOS: audioRecorderModule.AVEncodingOption.mp4, // same with aac
        AVEncoderAudioQualityKeyIOS: audioRecorderModule.AVEncoderAudioQualityIOSType.high,
      },
      default: {},
    });

    constructor() {
      module.setSubscriptionDuration(0.1);
      module.addRecordBackListener((data) => {
        const completed = data.currentPosition >= this.options.maxDuration;

        if (completed) this.stop();
        if (this.state === 'recording') {
          this.recordingSubscribers.forEach((callback) => {
            callback({ currentTime: data.currentPosition, completed });
          });
        }
      });
    }

    private setState = (state: RecorderServiceInterface['state']) => {
      this.state = state;
      this.stateSubscribers.forEach((callback) => {
        callback(state);
      });
    };

    public requestPermission = async (): Promise<boolean> => {
      const permission: Permission[] | undefined = Platform.select({
        android: [permissionModule.PERMISSIONS.ANDROID.RECORD_AUDIO],
        ios: [permissionModule.PERMISSIONS.IOS.MICROPHONE],
        windows: [permissionModule.PERMISSIONS.WINDOWS.MICROPHONE],
        default: undefined,
      });

      if (Platform.OS === 'android' && Platform.Version <= 28) {
        permission?.push(permissionModule.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      }

      if (permission) {
        const status = await permissionModule.checkMultiple(permission);
        if (nativePermissionGranted(status)) {
          return true;
        } else {
          const status = await permissionModule.requestMultiple(permission);
          return nativePermissionGranted(status);
        }
      } else {
        return true;
      }
    };

    public addRecordingListener = (callback: RecordingListener): Unsubscribe => {
      this.recordingSubscribers.add(callback);
      return () => {
        this.recordingSubscribers.delete(callback);
      };
    };

    public addStateListener = (callback: StateListener): Unsubscribe => {
      this.stateSubscribers.add(callback);
      return () => {
        this.stateSubscribers.delete(callback);
      };
    };

    public record = async (uri: string): Promise<void> => {
      if (matchesOneOf(this.state, ['idle', 'completed'])) {
        try {
          this.setState('preparing');
          await module.startRecorder(uri, {
            ...this.audioOptions,
          });

          if (Platform.OS === 'android') {
            this._recordStartedAt = Date.now();
          }

          this.uri = uri;
          this.setState('recording');
        } catch (e) {
          this.setState('idle');
          throw e;
        }
      }
    };

    public stop = async (): Promise<void> => {
      if (matchesOneOf(this.state, ['recording'])) {
        if (Platform.OS === 'android') {
          const buffer = this._getRecorderStopSafeBuffer();
          if (buffer > 0) await sleep(buffer);
        }

        await module.stopRecorder();
        this.setState('completed');
      }
    };

    public reset = async (): Promise<void> => {
      await this.stop();
      this.uri = undefined;
      this.recordingSubscribers.clear();
      this.setState('idle');
    };
  }

  return new VoiceRecorder();
};

export default createNativeRecorderService;
