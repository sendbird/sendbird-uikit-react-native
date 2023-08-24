import { Platform } from 'react-native';
import type * as RNAudioRecorder from 'react-native-audio-recorder-player';
import * as Permissions from 'react-native-permissions';

import type { PlayerServiceInterface, Unsubscribe } from './types';

type Modules = {
  audioRecorderModule: typeof RNAudioRecorder;
  permissionModule: typeof Permissions;
};
type Listener = (params: { currentTime: number; duration: number; stopped: boolean }) => void;
const createNativePlayerService = ({ audioRecorderModule, permissionModule }: Modules): PlayerServiceInterface => {
  const module = new audioRecorderModule.default();

  class Player implements PlayerServiceInterface {
    uri?: string;
    state: PlayerServiceInterface['state'] = 'idle';
    private readonly subscribers = new Set<Listener>();

    constructor() {
      this.state = 'idle';

      module.setSubscriptionDuration(0.1);
      module.addPlayBackListener((data) => {
        const stopped = data.currentPosition >= data.duration;

        if (stopped) this.stop();
        if (this.state === 'playing') {
          this.subscribers.forEach((callback) => {
            callback({ currentTime: data.currentPosition, duration: data.duration, stopped });
          });
        }
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

    addPlaybackListener(callback: Listener): Unsubscribe {
      this.subscribers.add(callback);
      return () => {
        this.subscribers.delete(callback);
      };
    }

    async play(uri: string): Promise<void> {
      if (this.state === 'idle' || this.state === 'stopped') {
        try {
          this.state = 'preparing';
          this.uri = uri;
          await module.startPlayer(uri);
          this.state = 'playing';
        } catch (e) {
          this.state = 'idle';
          this.uri = undefined;
          throw e;
        }
      } else if (this.state === 'paused' && this.uri === uri) {
        await module.resumePlayer();
        this.state = 'playing';
      }
    }

    async pause(): Promise<void> {
      if (this.state === 'playing') {
        await module.pausePlayer();
        this.state = 'paused';
      }
    }

    async stop(): Promise<void> {
      if (this.state === 'preparing' || this.state === 'playing' || this.state === 'paused') {
        await module.stopPlayer();
        this.state = 'stopped';
      }
    }

    async reset(): Promise<void> {
      await this.stop();
      this.state = 'idle';
      this.uri = undefined;
      this.subscribers.clear();
    }

    async seek(time: number): Promise<void> {
      if (this.state !== 'playing' && this.state !== 'paused') return;

      await module.seekToPlayer(time);
    }
  }

  return new Player();
};

export default createNativePlayerService;
