import { Platform } from 'react-native';
import type * as LegacyModule from 'react-native-audio-recorder-player';
import type * as NitroSoundOrLegacyV4Module from 'react-native-nitro-sound';
import * as Permissions from 'react-native-permissions';
import { Permission } from 'react-native-permissions/src/types';

import { Logger, matchesOneOf, sleep } from '@sendbird/uikit-utils';

import VoiceMessageConfig from '../libs/VoiceMessageConfig';
import nativePermissionGranted from '../utils/nativePermissionGranted';
import type { RecorderServiceInterface, Unsubscribe } from './types';

export type AudioRecorderModule = typeof LegacyModule | typeof NitroSoundOrLegacyV4Module;

type RecordingListener = Parameters<RecorderServiceInterface['addRecordingListener']>[number];
type StateListener = Parameters<RecorderServiceInterface['addStateListener']>[number];
type Modules = {
  audioRecorderModule: AudioRecorderModule;
  permissionModule: typeof Permissions;
};

interface RecordBackData {
  currentPosition: number;
  duration?: number;
}

interface RecorderModuleAdapter {
  setSubscriptionDuration(duration: number): Promise<void> | void;
  addRecordBackListener(callback: (data: RecordBackData) => void): void;
  convertRecordPath(uri: string): string;
  startRecorder(uri: string): Promise<void>;
  stopRecorder(): Promise<void>;
}

class AudioRecorderPlayerAdapter implements RecorderModuleAdapter {
  private module: InstanceType<typeof LegacyModule.default>;
  private readonly audioOptions;

  constructor(audioRecorderModule: typeof LegacyModule) {
    this.module = new audioRecorderModule.default();

    this.audioOptions = Platform.select({
      android: {
        AudioEncodingBitRateAndroid: VoiceMessageConfig.DEFAULT.RECORDER.BIT_RATE,
        AudioChannelsAndroid: VoiceMessageConfig.DEFAULT.RECORDER.CHANNELS,
        AudioSamplingRateAndroid: VoiceMessageConfig.DEFAULT.RECORDER.SAMPLE_RATE,
        AudioEncoderAndroid: audioRecorderModule.AudioEncoderAndroidType.AAC,
        OutputFormatAndroid: audioRecorderModule.OutputFormatAndroidType.MPEG_4,
        AudioSourceAndroid: audioRecorderModule.AudioSourceAndroidType.VOICE_RECOGNITION,
      },
      ios: {
        AVEncoderBitRateKeyIOS: VoiceMessageConfig.DEFAULT.RECORDER.BIT_RATE,
        AVNumberOfChannelsKeyIOS: VoiceMessageConfig.DEFAULT.RECORDER.CHANNELS,
        AVSampleRateKeyIOS: VoiceMessageConfig.DEFAULT.RECORDER.SAMPLE_RATE,
        AVFormatIDKeyIOS: audioRecorderModule.AVEncodingOption.mp4, // same with aac
        AVEncoderAudioQualityKeyIOS: audioRecorderModule.AVEncoderAudioQualityIOSType.high,
      },
      default: {},
    });
  }

  async setSubscriptionDuration(duration: number): Promise<void> {
    await this.module.setSubscriptionDuration(duration);
  }

  addRecordBackListener(callback: (data: RecordBackData) => void): void {
    this.module.addRecordBackListener(callback);
  }

  convertRecordPath(uri: string): string {
    return Platform.OS === 'ios' ? uri.split('/').pop() || uri : uri;
  }

  async startRecorder(uri: string): Promise<void> {
    await this.module.startRecorder(uri, this.audioOptions as Parameters<typeof this.module.startRecorder>[1]);
  }

  async stopRecorder(): Promise<void> {
    await this.module.stopRecorder();
  }
}

class NitroSoundOrLegacyV4Adapter implements RecorderModuleAdapter {
  private module;
  private readonly audioOptions;

  constructor(audioRecorderModule: typeof NitroSoundOrLegacyV4Module) {
    this.module = audioRecorderModule.default;
    this.audioOptions = Platform.select({
      android: {
        AudioEncodingBitRateAndroid: VoiceMessageConfig.DEFAULT.RECORDER.BIT_RATE,
        AudioChannelsAndroid: VoiceMessageConfig.DEFAULT.RECORDER.CHANNELS,
        AudioSamplingRateAndroid: VoiceMessageConfig.DEFAULT.RECORDER.SAMPLE_RATE,
        AudioEncoderAndroid: audioRecorderModule.AudioEncoderAndroidType.AAC,
        OutputFormatAndroid: audioRecorderModule.OutputFormatAndroidType.MPEG_4,
        AudioSourceAndroid: audioRecorderModule.AudioSourceAndroidType.VOICE_RECOGNITION,
      },
      ios: {
        AVEncoderBitRateKeyIOS: VoiceMessageConfig.DEFAULT.RECORDER.BIT_RATE,
        AVNumberOfChannelsKeyIOS: VoiceMessageConfig.DEFAULT.RECORDER.CHANNELS,
        AVSampleRateKeyIOS: VoiceMessageConfig.DEFAULT.RECORDER.SAMPLE_RATE,
        AVFormatIDKeyIOS: 'mp4', // same with aac
        AVEncoderAudioQualityKeyIOS: audioRecorderModule.AVEncoderAudioQualityIOSType.high,
      },
      default: {},
    });
  }

  setSubscriptionDuration(duration: number): void {
    try {
      this.module.setSubscriptionDuration(duration);
    } catch (error) {
      Logger.warn('[RecorderService.Native] Failed to set subscription duration', error);
    }
  }

  addRecordBackListener(callback: (data: RecordBackData) => void): void {
    this.module.addRecordBackListener(callback);
  }

  convertRecordPath(uri: string): string {
    return uri;
  }

  async startRecorder(uri: string): Promise<void> {
    await this.module.startRecorder(uri, this.audioOptions as Parameters<typeof this.module.startRecorder>[1]);
  }

  async stopRecorder(): Promise<void> {
    await this.module.stopRecorder();
  }
}

class VoiceRecorder implements RecorderServiceInterface {
  public uri: RecorderServiceInterface['uri'] = undefined;
  public state: RecorderServiceInterface['state'] = 'idle';
  public options: RecorderServiceInterface['options'] = {
    minDuration: VoiceMessageConfig.DEFAULT.RECORDER.MIN_DURATION,
    maxDuration: VoiceMessageConfig.DEFAULT.RECORDER.MAX_DURATION,
    extension: VoiceMessageConfig.DEFAULT.RECORDER.EXTENSION,
  };

  private _recordStartedAt = 0;
  private _stopping = false;
  private readonly recordingSubscribers = new Set<RecordingListener>();
  private readonly stateSubscribers = new Set<StateListener>();

  constructor(private readonly adapter: RecorderModuleAdapter, private readonly permissionModule: typeof Permissions) {
    this.initialize();
  }

  private initialize(): void {
    const setDurationResult = this.adapter.setSubscriptionDuration(0.1);
    if (setDurationResult instanceof Promise) {
      setDurationResult.catch((error) => {
        Logger.warn('[RecorderService.Native] Failed to set subscription duration', error);
      });
    }

    this.adapter.addRecordBackListener((data) => {
      const completed = data.currentPosition >= this.options.maxDuration;

      if (completed) {
        this.stop().catch((error) => {
          Logger.warn('[RecorderService.Native] Failed to stop in RecordBackListener', error);
        });
      }
      if (this.state === 'recording') {
        this.recordingSubscribers.forEach((callback) => {
          callback({ currentTime: data.currentPosition, completed });
        });
      }
    });
  }

  private setState = (state: RecorderServiceInterface['state']): void => {
    this.state = state;
    this.stateSubscribers.forEach((callback) => {
      callback(state);
    });
  };

  private getRecorderStopSafeBuffer = (): number => {
    const minWaitingTime = 500;
    const elapsedTime = Date.now() - this._recordStartedAt;
    if (elapsedTime > minWaitingTime) return 0;
    else return minWaitingTime - elapsedTime;
  };

  public requestPermission = async (): Promise<boolean> => {
    const permission: Permission[] | undefined = Platform.select({
      android: [this.permissionModule.PERMISSIONS.ANDROID.RECORD_AUDIO],
      ios: [this.permissionModule.PERMISSIONS.IOS.MICROPHONE],
      windows: [this.permissionModule.PERMISSIONS.WINDOWS.MICROPHONE],
      default: undefined,
    });

    if (Platform.OS === 'android' && Platform.Version <= 28) {
      permission?.push(this.permissionModule.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    }

    if (permission) {
      const status = await this.permissionModule.checkMultiple(permission);
      if (nativePermissionGranted(status)) {
        return true;
      } else {
        const status = await this.permissionModule.requestMultiple(permission);
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
        await this.adapter.startRecorder(uri);

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
    if (matchesOneOf(this.state, ['recording']) && !this._stopping) {
      this._stopping = true;
      try {
        if (Platform.OS === 'android') {
          const buffer = this.getRecorderStopSafeBuffer();
          if (buffer > 0) await sleep(buffer);
        }

        await this.adapter.stopRecorder();
        this.setState('completed');
      } catch (error) {
        Logger.error('[RecorderService.Native] Failed to stop recorder', error);
        throw error;
      } finally {
        this._stopping = false;
      }
    }
  };

  public reset = async (): Promise<void> => {
    await this.stop();
    this.uri = undefined;
    this.recordingSubscribers.clear();
    this.setState('idle');
  };

  public convertRecordPath = (uri: string): string => {
    return this.adapter.convertRecordPath(uri);
  };
}

const createNativeRecorderService = (modules: Modules): RecorderServiceInterface => {
  const adapter = isNitroSoundOrLegacyV4Module(modules.audioRecorderModule)
    ? new NitroSoundOrLegacyV4Adapter(modules.audioRecorderModule)
    : new AudioRecorderPlayerAdapter(modules.audioRecorderModule as typeof LegacyModule);

  return new VoiceRecorder(adapter, modules.permissionModule);
};

function isNitroSoundOrLegacyV4Module(module: AudioRecorderModule): module is typeof NitroSoundOrLegacyV4Module {
  const isNitroSound = 'createSound' in module && typeof module.createSound === 'function';
  const isLegacyV4 =
    'default' in module && 'getHybridObject' in module.default && typeof module.default.getHybridObject === 'function';
  if (isLegacyV4) {
    Logger.warn('react-native-audio-recorder-player is deprecated. Please use react-native-nitro-sound instead.');
  }
  return isNitroSound || isLegacyV4;
}

export default createNativeRecorderService;
