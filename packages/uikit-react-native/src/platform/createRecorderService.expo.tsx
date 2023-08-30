import * as ExpoAV from 'expo-av';
import type { RecordingOptions } from 'expo-av/build/Audio/Recording.types';

import { matchesOneOf } from '@sendbird/uikit-utils';

import expoPermissionGranted from '../utils/expoPermissionGranted';
import type { RecorderServiceInterface, Unsubscribe } from './types';

type RecordingListener = Parameters<RecorderServiceInterface['addRecordingListener']>[number];
type StateListener = Parameters<RecorderServiceInterface['addStateListener']>[number];
type Modules = {
  avModule: typeof ExpoAV;
};
const createNativeRecorderService = ({ avModule }: Modules): RecorderServiceInterface => {
  const recorder = new avModule.Audio.Recording();

  class VoiceRecorder implements RecorderServiceInterface {
    public state: RecorderServiceInterface['state'] = 'idle';
    public options: RecorderServiceInterface['options'] = {
      minDuration: 1000,
      maxDuration: 60000,
      extension: 'm4a',
    };

    // NOTE: In Android, even when startRecorder() is awaited, if stop() is executed immediately afterward, an error occurs
    // private _recordStartedAt = 0;
    // private _getRecorderStopSafeBuffer = () => {
    //   const minWaitingTime = 500;
    //   const elapsedTime = Date.now() - this._recordStartedAt;
    //   if (elapsedTime > minWaitingTime) return 0;
    //   else return minWaitingTime - elapsedTime;
    // };

    private readonly recordingSubscribers = new Set<RecordingListener>();
    private readonly stateSubscribers = new Set<StateListener>();
    private readonly audioSettings = {
      sampleRate: 11025,
      bitRate: 12000,
      numberOfChannels: 1,
      // encoding: mpeg4_aac
    };
    private readonly audioOptions: RecordingOptions = {
      android: {
        ...this.audioSettings,
        extension: this.options.extension,
        audioEncoder: avModule.Audio.AndroidAudioEncoder.AAC,
        outputFormat: avModule.Audio.AndroidOutputFormat.MPEG_4,
      },
      ios: {
        ...this.audioSettings,
        extension: this.options.extension,
        outputFormat: avModule.Audio.IOSOutputFormat.MPEG4AAC,
        audioQuality: avModule.Audio.IOSAudioQuality.HIGH,
      },
      web: {},
    };

    constructor() {
      recorder.setProgressUpdateInterval(100);
      recorder.setOnRecordingStatusUpdate((status) => {
        const completed = status.durationMillis >= this.options.maxDuration;
        if (completed) this.stop();
        if (status.isRecording) {
          this.recordingSubscribers.forEach((callback) => {
            callback({ currentTime: status.durationMillis, completed: completed });
          });
        }
      });
    }

    private prepare = async () => {
      this.setState('preparing');
      await recorder.prepareToRecordAsync(this.audioOptions);
    };

    private setState = (state: RecorderServiceInterface['state']) => {
      this.state = state;
      this.stateSubscribers.forEach((callback) => {
        callback(state);
      });
    };

    public requestPermission = async (): Promise<boolean> => {
      const status = await avModule.Audio.getPermissionsAsync();
      if (expoPermissionGranted(status)) {
        return true;
      } else {
        const status = await avModule.Audio.requestPermissionsAsync();
        return expoPermissionGranted(status);
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

    public record = async (): Promise<void> => {
      if (matchesOneOf(this.state, ['idle', 'completed'])) {
        try {
          await this.prepare();
          await recorder.startAsync();

          // if (Platform.OS === 'android') {
          //   this._recordStartedAt = Date.now();
          // }

          this.setState('recording');
        } catch (e) {
          this.setState('idle');
          throw e;
        }
      }
    };

    public stop = async (): Promise<void> => {
      if (matchesOneOf(this.state, ['recording'])) {
        // if (Platform.OS === 'android') {
        //   const buffer = this._getRecorderStopSafeBuffer();
        //   if (buffer > 0) await sleep(buffer);
        // }

        await recorder.stopAndUnloadAsync();
        this.setState('completed');
      }
    };

    public reset = async (): Promise<void> => {
      await this.stop();
      this.setState('idle');
      this.recordingSubscribers.clear();
    };
  }

  return new VoiceRecorder();
};

export default createNativeRecorderService;
