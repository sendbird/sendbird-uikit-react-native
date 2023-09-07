import * as ExpoAV from 'expo-av';
import type { RecordingOptions } from 'expo-av/build/Audio/Recording.types';
import { Platform } from 'react-native';

import { matchesOneOf, sleep } from '@sendbird/uikit-utils';

import VoiceMessageConfig from '../libs/VoiceMessageConfig';
import expoPermissionGranted from '../utils/expoPermissionGranted';
import type { RecorderServiceInterface, Unsubscribe } from './types';

type RecordingListener = Parameters<RecorderServiceInterface['addRecordingListener']>[number];
type StateListener = Parameters<RecorderServiceInterface['addStateListener']>[number];
type Modules = {
  avModule: typeof ExpoAV;
};
const createExpoRecorderService = ({ avModule }: Modules): RecorderServiceInterface => {
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

    private _recorder = new avModule.Audio.Recording();
    private readonly _recordingSubscribers = new Set<RecordingListener>();
    private readonly _stateSubscribers = new Set<StateListener>();
    private readonly _audioSettings = {
      sampleRate: VoiceMessageConfig.DEFAULT.RECORDER.SAMPLE_RATE,
      bitRate: VoiceMessageConfig.DEFAULT.RECORDER.BIT_RATE,
      numberOfChannels: VoiceMessageConfig.DEFAULT.RECORDER.CHANNELS,
      // encoding: mpeg4_aac
    };
    private readonly _audioOptions: RecordingOptions = {
      android: {
        ...this._audioSettings,
        extension: `.${this.options.extension}`,
        audioEncoder: avModule.Audio.AndroidAudioEncoder.AAC,
        outputFormat: avModule.Audio.AndroidOutputFormat.MPEG_4,
      },
      ios: {
        ...this._audioSettings,
        extension: `.${this.options.extension}`,
        outputFormat: avModule.Audio.IOSOutputFormat.MPEG4AAC,
        audioQuality: avModule.Audio.IOSAudioQuality.HIGH,
      },
      web: {},
    };

    private prepare = async () => {
      this.setState('preparing');
      if (Platform.OS === 'ios') {
        await avModule.Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      }

      if (this._recorder._isDoneRecording) {
        this._recorder = new avModule.Audio.Recording();
      }
      this._recorder.setProgressUpdateInterval(100);
      this._recorder.setOnRecordingStatusUpdate((status) => {
        const completed = status.durationMillis >= this.options.maxDuration;
        if (completed) this.stop();
        if (status.isRecording) {
          this._recordingSubscribers.forEach((callback) => {
            callback({ currentTime: status.durationMillis, completed: completed });
          });
        }
      });
      await this._recorder.prepareToRecordAsync(this._audioOptions);
    };

    private setState = (state: RecorderServiceInterface['state']) => {
      this.state = state;
      this._stateSubscribers.forEach((callback) => {
        callback(state);
      });
    };

    public requestPermission = async (): Promise<boolean> => {
      const status = await avModule.Audio.getPermissionsAsync();
      if (expoPermissionGranted([status])) {
        return true;
      } else {
        const status = await avModule.Audio.requestPermissionsAsync();
        return expoPermissionGranted([status]);
      }
    };

    public addRecordingListener = (callback: RecordingListener): Unsubscribe => {
      this._recordingSubscribers.add(callback);
      return () => {
        this._recordingSubscribers.delete(callback);
      };
    };

    public addStateListener = (callback: StateListener): Unsubscribe => {
      this._stateSubscribers.add(callback);
      return () => {
        this._stateSubscribers.delete(callback);
      };
    };

    public record = async (): Promise<void> => {
      if (matchesOneOf(this.state, ['idle', 'completed'])) {
        try {
          await this.prepare();
          await this._recorder.startAsync();

          if (Platform.OS === 'android') {
            this._recordStartedAt = Date.now();
          }

          const uri = this._recorder.getURI();
          if (uri) this.uri = uri;
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

        await this._recorder.stopAndUnloadAsync();
        if (Platform.OS === 'ios') {
          await avModule.Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: false });
        }
        this.setState('completed');
      }
    };

    public reset = async (): Promise<void> => {
      await this.stop();
      this.uri = undefined;
      this._recordingSubscribers.clear();
      this._recorder = new avModule.Audio.Recording();
      this.setState('idle');
    };
  }

  return new VoiceRecorder();
};

export default createExpoRecorderService;
