import { Platform } from 'react-native';
import * as RNAudioRecorder from 'react-native-audio-recorder-player';
import * as Permissions from 'react-native-permissions';
import { Permission } from 'react-native-permissions/src/types';

import nativePermissionGranted from '../utils/nativePermissionGranted';
import type { RecorderServiceInterface, Unsubscribe } from './types';

type Modules = {
  audioRecorderModule: typeof RNAudioRecorder;
  permissionModule: typeof Permissions;
};
const createNativeRecorderService = ({ audioRecorderModule, permissionModule }: Modules): RecorderServiceInterface => {
  const module = new audioRecorderModule.default();

  class Recorder implements RecorderServiceInterface {
    state: RecorderServiceInterface['state'] = 'idle';
    private readonly subscribers = new Set<(currentTime: number) => void>();
    private readonly audioSettings = {
      sampleRate: 11025,
      bitRate: 12000,
      audioChannels: 1,
    };
    private readonly audioOptions = {
      AVEncoderBitRateKeyIOS: this.audioSettings.bitRate,
      AudioEncodingBitRateAndroid: this.audioSettings.bitRate,
      AVNumberOfChannelsKeyIOS: this.audioSettings.audioChannels,
      AudioChannelsAndroid: this.audioSettings.audioChannels,
      AVSampleRateKeyIOS: this.audioSettings.sampleRate,
      AudioSamplingRateAndroid: this.audioSettings.sampleRate,
      AudioEncoderAndroid: audioRecorderModule.AudioEncoderAndroidType.AAC,
      AVFormatIDKeyIOS: audioRecorderModule.AVEncodingOption.aac,
      AudioSourceAndroid: audioRecorderModule.AudioSourceAndroidType.VOICE_RECOGNITION,
      AVEncoderAudioQualityKeyIOS: audioRecorderModule.AVEncoderAudioQualityIOSType.high,
      OutputFormatAndroid: audioRecorderModule.OutputFormatAndroidType.MPEG_4,
    };

    constructor() {
      this.state = 'idle';

      module.setSubscriptionDuration(1);
      module.addRecordBackListener((data) => {
        this.subscribers.forEach((callback) => {
          callback(data.currentPosition);
        });
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

    async record(uri?: string): Promise<void> {
      if (this.state === 'recording') return;

      try {
        this.state = 'preparing';
        await module.startRecorder(uri, this.audioOptions);
        this.state = 'recording';
      } catch {
        this.state = 'idle';
      }
    }

    async stop(): Promise<void> {
      if (this.state === 'completed') return;

      await module.stopRecorder();
      this.state = 'completed';
    }

    async reset(): Promise<void> {
      await this.stop();
      this.state = 'idle';
      this.subscribers.clear();
    }

    addListener(callback: (currentTime: number) => void): Unsubscribe {
      this.subscribers.add(callback);
      return () => {
        this.subscribers.delete(callback);
      };
    }
  }

  return new Recorder();
};

export default createNativeRecorderService;
