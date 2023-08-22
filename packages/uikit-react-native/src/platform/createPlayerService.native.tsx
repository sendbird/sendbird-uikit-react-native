import { Platform } from 'react-native';
import type * as RNAudioRecorder from 'react-native-audio-recorder-player';
import * as Permissions from 'react-native-permissions';

import type { PlayerServiceInterface, Unsubscribe } from './types';

type Modules = {
  audioRecorderModule: typeof RNAudioRecorder;
  permissionModule: typeof Permissions;
};

const createNativePlayerService = ({ audioRecorderModule, permissionModule }: Modules): PlayerServiceInterface => {
  const module = new audioRecorderModule.default();

  class Player implements PlayerServiceInterface {
    state: PlayerServiceInterface['state'] = 'idle';
    private readonly subscribers = new Set<(currentTime: number, duration: number) => void>();

    constructor() {
      this.state = 'idle';

      module.setSubscriptionDuration(1);
      module.addPlayBackListener((data) => {
        this.subscribers.forEach((callback) => {
          callback(data.currentPosition, data.duration);
        });
      });
    }

    async requestPermission(): Promise<boolean> {
      if (Platform.OS === 'android') {
        const { READ_MEDIA_AUDIO, READ_EXTERNAL_STORAGE } = permissionModule.PERMISSIONS.ANDROID;
        const permission = Platform.Version > 32 ? READ_MEDIA_AUDIO : READ_EXTERNAL_STORAGE;

        const status = await permissionModule.check(permission);
        if (status === 'granted') {
          return true;
        } else {
          const status = await permissionModule.request(permission);
          return status === 'granted';
        }
      } else {
        return true;
      }
    }

    async play(uri: string, headers?: Record<string, string>): Promise<void> {
      if (this.state === 'playing') return;

      try {
        this.state = 'preparing';
        await module.startPlayer(uri, headers);
        this.state = 'playing';
      } catch {
        this.state = 'idle';
      }
    }

    async seek(time: number): Promise<void> {
      if (this.state !== 'playing') return;

      await module.seekToPlayer(time);
    }

    async pause(): Promise<void> {
      if (this.state === 'paused' || this.state === 'stopped') return;

      await module.pausePlayer();
      this.state = 'paused';
    }

    async stop(): Promise<void> {
      if (this.state === 'stopped') return;

      await module.stopPlayer();
      this.state = 'stopped';
    }

    async reset(): Promise<void> {
      await this.stop();
      this.state = 'idle';
      this.subscribers.clear();
    }

    addListener(callback: (currentTime: number, duration: number) => void): Unsubscribe {
      this.subscribers.add(callback);
      return () => {
        this.subscribers.delete(callback);
      };
    }
  }

  return new Player();
};

export default createNativePlayerService;
