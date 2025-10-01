import type * as ExpoAudio from 'expo-audio';
import type * as ExpoAV from 'expo-av';
import { Platform } from 'react-native';

import { Logger, matchesOneOf, sleep } from '@sendbird/uikit-utils';

import VoiceMessageConfig from '../libs/VoiceMessageConfig';
import expoBackwardUtils from '../utils/expoBackwardUtils';
import type { ExpoAudioModule } from '../utils/expoBackwardUtils';
import expoPermissionGranted from '../utils/expoPermissionGranted';
import type { RecorderServiceInterface, Unsubscribe } from './types';

type RecordingListener = Parameters<RecorderServiceInterface['addRecordingListener']>[number];
type StateListener = Parameters<RecorderServiceInterface['addStateListener']>[number];
type Modules = {
  avModule: ExpoAudioModule;
};

interface AudioRecorderAdapter {
  requestPermission(): Promise<boolean>;
  record(): Promise<void>;
  stop(): Promise<void>;
  reset(): Promise<void>;
  addRecordingListener(callback: RecordingListener): Unsubscribe;
  addStateListener(callback: StateListener): Unsubscribe;
  convertRecordPath(uri: string): string;
  readonly state: RecorderServiceInterface['state'];
  readonly options: RecorderServiceInterface['options'];
  uri?: string;
}

abstract class BaseAudioRecorderAdapter implements AudioRecorderAdapter {
  public uri: RecorderServiceInterface['uri'] = undefined;
  public state: RecorderServiceInterface['state'] = 'idle';
  public options: RecorderServiceInterface['options'] = {
    minDuration: VoiceMessageConfig.DEFAULT.RECORDER.MIN_DURATION,
    maxDuration: VoiceMessageConfig.DEFAULT.RECORDER.MAX_DURATION,
    extension: VoiceMessageConfig.DEFAULT.RECORDER.EXTENSION,
  };

  protected readonly _audioSettings = {
    sampleRate: VoiceMessageConfig.DEFAULT.RECORDER.SAMPLE_RATE,
    bitRate: VoiceMessageConfig.DEFAULT.RECORDER.BIT_RATE,
    numberOfChannels: VoiceMessageConfig.DEFAULT.RECORDER.CHANNELS,
    // encoding: mpeg4_aac
  };
  protected readonly _recordingSubscribers = new Set<RecordingListener>();
  protected readonly _stateSubscribers = new Set<StateListener>();

  // NOTE: In Android, even when startRecorder() is awaited, if stop() is executed immediately afterward, an error occurs
  protected _recordStartedAt = 0;
  protected _getRecorderStopSafeBuffer = () => {
    const minWaitingTime = 500;
    const elapsedTime = Date.now() - this._recordStartedAt;
    if (elapsedTime > minWaitingTime) return 0;
    else return minWaitingTime - elapsedTime;
  };
  protected setState = (state: RecorderServiceInterface['state']) => {
    this.state = state;
    this._stateSubscribers.forEach((callback) => {
      callback(state);
    });
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

  public convertRecordPath = (uri: string): string => {
    return uri;
  };

  abstract requestPermission(): Promise<boolean>;
  abstract record(): Promise<void>;
  abstract stop(): Promise<void>;
  abstract reset(): Promise<void>;
}

class LegacyExpoAVRecorderAdapter extends BaseAudioRecorderAdapter {
  private readonly avModule: typeof ExpoAV;

  private _recorder: ExpoAV.Audio.Recording;
  private readonly _audioOptions: ExpoAV.Audio.RecordingOptions;

  constructor(avModule: typeof ExpoAV) {
    super();
    this.avModule = avModule;
    this._recorder = new avModule.Audio.Recording();
    this._audioOptions = {
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
  }

  private prepare = async () => {
    this.setState('preparing');
    if (Platform.OS === 'ios') {
      await this.avModule.Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    }

    if (this._recorder._isDoneRecording) {
      this._recorder = new this.avModule.Audio.Recording();
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

  public requestPermission = async (): Promise<boolean> => {
    const status = await this.avModule.Audio.getPermissionsAsync();
    if (expoPermissionGranted([status])) {
      return true;
    } else {
      const status = await this.avModule.Audio.requestPermissionsAsync();
      return expoPermissionGranted([status]);
    }
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
        await this.avModule.Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: false });
      }
      this.setState('completed');
    }
  };

  public reset = async (): Promise<void> => {
    await this.stop();
    this.uri = undefined;
    this._recordingSubscribers.clear();
    this._recorder = new this.avModule.Audio.Recording();
    this.setState('idle');
  };
}

class ExpoAudioRecorderAdapter extends BaseAudioRecorderAdapter {
  private readonly audioModule: typeof ExpoAudio;
  private recorder: ExpoAudio.AudioRecorder | null = null;
  private recordingUpdateInterval: NodeJS.Timeout | null = null;

  constructor(audioModule: typeof ExpoAudio) {
    super();
    this.audioModule = audioModule;
  }

  private setListener = () => {
    if (!this.recorder) return;

    this.recordingUpdateInterval = setInterval(() => {
      if (this.recorder && this.recorder.isRecording) {
        const currentTime = this.recorder.currentTime * 1000;
        const completed = currentTime >= this.options.maxDuration;

        if (completed) {
          this.stop().catch((error) => {
            Logger.warn('[RecorderService.Expo] Failed to stop in update interval', error);
          });
        }

        this._recordingSubscribers.forEach((callback) => {
          callback({ currentTime, completed });
        });
      }
    }, 100);
  };

  private removeListener = () => {
    if (this.recordingUpdateInterval) {
      clearInterval(this.recordingUpdateInterval);
      this.recordingUpdateInterval = null;
    }
  };

  private prepare = async () => {
    this.setState('preparing');
    if (Platform.OS === 'ios') {
      await this.audioModule.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
    }

    const recordingOptions = {
      ...this._audioSettings,
      extension: `.${this.options.extension}`,
    };

    this.recorder = new this.audioModule.AudioModule.AudioRecorder(recordingOptions);
    await this.recorder.prepareToRecordAsync();
  };

  public requestPermission = async (): Promise<boolean> => {
    const status = await this.audioModule.getRecordingPermissionsAsync();
    if (expoPermissionGranted([status])) {
      return true;
    } else {
      const status = await this.audioModule.requestRecordingPermissionsAsync();
      return expoPermissionGranted([status]);
    }
  };

  public record = async (): Promise<void> => {
    if (matchesOneOf(this.state, ['idle', 'completed'])) {
      try {
        await this.prepare();
        this.setListener();
        this.recorder?.record();

        if (Platform.OS === 'android') {
          this._recordStartedAt = Date.now();
        }

        const uri = this.recorder?.uri;
        if (uri) this.uri = uri;
        this.setState('recording');
      } catch (e) {
        this.setState('idle');
        this.removeListener();
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

      await this.recorder?.stop();
      this.removeListener();
      if (Platform.OS === 'ios') {
        await this.audioModule.setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: false,
        });
      }
      this.setState('completed');
    }
  };

  public reset = async (): Promise<void> => {
    await this.stop();
    this.recorder = null;
    this.uri = undefined;
    this._recordingSubscribers.clear();
    this._stateSubscribers.clear();
    this.setState('idle');
  };
}

const createExpoRecorderService = ({ avModule }: Modules): RecorderServiceInterface => {
  if (expoBackwardUtils.expoAV.isLegacyAVModule(avModule)) {
    Logger.warn(
      '[RecorderService.Expo] expo-av is deprecated and will be removed in Expo 54. Please migrate to expo-audio.',
    );
  }

  const audioAdapter = expoBackwardUtils.expoAV.isAudioModule(avModule)
    ? new ExpoAudioRecorderAdapter(avModule)
    : new LegacyExpoAVRecorderAdapter(avModule as typeof ExpoAV);

  return {
    get uri() {
      return audioAdapter.uri;
    },
    get state() {
      return audioAdapter.state;
    },
    get options() {
      return audioAdapter.options;
    },
    requestPermission: audioAdapter.requestPermission.bind(audioAdapter),
    addRecordingListener: audioAdapter.addRecordingListener.bind(audioAdapter),
    addStateListener: audioAdapter.addStateListener.bind(audioAdapter),
    record: audioAdapter.record.bind(audioAdapter),
    stop: audioAdapter.stop.bind(audioAdapter),
    reset: audioAdapter.reset.bind(audioAdapter),
    convertRecordPath: audioAdapter.convertRecordPath.bind(audioAdapter),
  };
};

export default createExpoRecorderService;
