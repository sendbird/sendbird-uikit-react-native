import { Platform } from 'react-native';
import * as RNAudioRecorder from 'react-native-audio-recorder-player';
import * as Permissions from 'react-native-permissions';
import { Permission } from 'react-native-permissions/src/types';

import { matchesOneOf, sleep } from '@sendbird/uikit-utils';

import nativePermissionGranted from '../utils/nativePermissionGranted';
import type { RecorderServiceInterface, Unsubscribe } from './types';

type Listener = (params: { currentTime: number; completed: boolean }) => void;
type Modules = {
  audioRecorderModule: typeof RNAudioRecorder;
  permissionModule: typeof Permissions;
};
const createNativeRecorderService = ({ audioRecorderModule, permissionModule }: Modules): RecorderServiceInterface => {
  const module = new audioRecorderModule.default();

  class Recorder implements RecorderServiceInterface {
    // NOTE: In Android, even when startRecorder() is awaited, if stop() is executed immediately afterward, an error occurs
    private _recordStartedAt = 0;
    private _getRecorderStopSafeBuffer() {
      const minWaitingTime = 500;
      const elapsedTime = Date.now() - this._recordStartedAt;
      if (elapsedTime > minWaitingTime) return 0;
      else return minWaitingTime - elapsedTime;
    }

    state: RecorderServiceInterface['state'] = 'idle';
    options: RecorderServiceInterface['options'] = {
      minDuration: 1000,
      maxDuration: 60000,
      extension: 'm4a',
    };

    private readonly subscribers = new Set<Listener>();
    private readonly audioSettings = {
      sampleRate: 11025,
      bitRate: 12000,
      audioChannels: 1,
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
      this.state = 'idle';

      module.setSubscriptionDuration(0.1);
      module.addRecordBackListener((data) => {
        const completed = data.currentPosition >= this.options.maxDuration;

        if (completed) this.stop();
        if (this.state === 'recording') {
          this.subscribers.forEach((callback) => {
            callback({ currentTime: data.currentPosition, completed });
          });
        }
      });
    }

    async requestPermission(): Promise<boolean> {
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
    }

    addRecordingListener(callback: Listener): Unsubscribe {
      this.subscribers.add(callback);
      return () => {
        this.subscribers.delete(callback);
      };
    }

    async record(uri?: string): Promise<void> {
      if (matchesOneOf(this.state, ['idle', 'completed'])) {
        try {
          this.state = 'preparing';
          await module.startRecorder(uri, {
            ...this.audioOptions,
          });

          if (Platform.OS === 'android') {
            this._recordStartedAt = Date.now();
          }

          this.state = 'recording';
        } catch (e) {
          this.state = 'idle';
          throw e;
        }
      }
    }

    async stop(): Promise<void> {
      if (matchesOneOf(this.state, ['recording'])) {
        if (Platform.OS === 'android') {
          const buffer = this._getRecorderStopSafeBuffer();
          if (buffer > 0) await sleep(buffer);
        }

        await module.stopRecorder();
        this.state = 'completed';
      }
    }

    async reset(): Promise<void> {
      await this.stop();
      this.state = 'idle';
      this.subscribers.clear();
    }
  }

  return new Recorder();
};

export default createNativeRecorderService;
