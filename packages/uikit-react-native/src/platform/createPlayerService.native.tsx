import { Platform } from 'react-native';
import type * as LegacyModule from 'react-native-audio-recorder-player';
import type * as NitroSoundOrLegacyV4Module from 'react-native-nitro-sound';
import * as Permissions from 'react-native-permissions';

import { Logger, matchesOneOf, sleep } from '@sendbird/uikit-utils';

import { AudioRecorderModule } from './createRecorderService.native';
import type { PlayerServiceInterface, Unsubscribe } from './types';

export type AudioPlayerModule = typeof LegacyModule | typeof NitroSoundOrLegacyV4Module;

type Modules = {
  audioRecorderModule: AudioPlayerModule;
  permissionModule: typeof Permissions;
};
type PlaybackListener = Parameters<PlayerServiceInterface['addPlaybackListener']>[number];
type StateListener = Parameters<PlayerServiceInterface['addStateListener']>[number];

interface PlayBackData {
  currentPosition: number;
  duration: number;
}

interface PlayerModuleAdapter {
  setSubscriptionDuration(duration: number): Promise<void> | void;
  addPlayBackListener(callback: (data: PlayBackData) => void): void;
  removePlayBackListener(): void;
  startPlayer(uri: string): Promise<void>;
  pausePlayer(): Promise<void>;
  resumePlayer(): Promise<void>;
  stopPlayer(): Promise<void>;
  seekToPlayer(time: number): Promise<void>;
}

class AudioRecorderPlayerAdapter implements PlayerModuleAdapter {
  private module: InstanceType<typeof LegacyModule.default>;

  constructor(audioRecorderModule: typeof LegacyModule) {
    this.module = new audioRecorderModule.default();
  }

  async setSubscriptionDuration(duration: number): Promise<void> {
    await this.module.setSubscriptionDuration(duration);
  }

  addPlayBackListener(callback: (data: PlayBackData) => void): void {
    this.module.addPlayBackListener(callback);
  }

  removePlayBackListener(): void {
    this.module.removePlayBackListener();
  }

  async startPlayer(uri: string): Promise<void> {
    await this.module.startPlayer(uri);
  }

  async pausePlayer(): Promise<void> {
    await this.module.pausePlayer();
  }

  async resumePlayer(): Promise<void> {
    await this.module.resumePlayer();
  }

  async stopPlayer(): Promise<void> {
    await this.module.stopPlayer();
  }

  async seekToPlayer(time: number): Promise<void> {
    await this.module.seekToPlayer(time);
  }
}

class NitroSoundOrLegacyV4Adapter implements PlayerModuleAdapter {
  private module;

  constructor(audioRecorderModule: typeof NitroSoundOrLegacyV4Module) {
    this.module = audioRecorderModule.default;
  }

  setSubscriptionDuration(duration: number): void {
    try {
      this.module.setSubscriptionDuration(duration);
    } catch (error) {
      Logger.warn('[PlayerService.Native] Failed to set subscription duration', error);
    }
  }

  addPlayBackListener(callback: (data: PlayBackData) => void): void {
    this.module.addPlayBackListener(callback);
  }

  removePlayBackListener(): void {
    this.module.removePlayBackListener();
  }

  async startPlayer(uri: string): Promise<void> {
    await this.module.startPlayer(uri);
  }

  async pausePlayer(): Promise<void> {
    await this.module.pausePlayer();
  }

  async resumePlayer(): Promise<void> {
    await this.module.resumePlayer();
  }

  async stopPlayer(): Promise<void> {
    await this.module.stopPlayer();
  }

  async seekToPlayer(time: number): Promise<void> {
    await this.module.seekToPlayer(time);
  }
}

class VoicePlayer implements PlayerServiceInterface {
  public uri?: string;
  public state: PlayerServiceInterface['state'] = 'idle';

  private readonly playbackSubscribers = new Set<PlaybackListener>();
  private readonly stateSubscribers = new Set<StateListener>();

  constructor(private readonly adapter: PlayerModuleAdapter, private readonly permissionModule: typeof Permissions) {
    this.initialize();
  }

  private initialize(): void {
    const setDurationResult = this.adapter.setSubscriptionDuration(0.1);
    if (setDurationResult instanceof Promise) {
      setDurationResult.catch((error) => {
        Logger.warn('[PlayerService.Native] Failed to set subscription duration', error);
      });
    }
  }

  private setState = (state: PlayerServiceInterface['state']) => {
    this.state = state;
    this.stateSubscribers.forEach((callback) => {
      callback(state);
    });
  };

  private setListener = () => {
    this.adapter.addPlayBackListener(async (data) => {
      const stopped = data.currentPosition >= data.duration;

      if (stopped) {
        this.stop().catch((error) => {
          Logger.warn('[PlayerService.Native] Failed to stop in PlayBackListener', error);
        });
      }
      if (this.state === 'playing') {
        this.playbackSubscribers.forEach((callback) => {
          callback({ currentTime: data.currentPosition, duration: data.duration, stopped });
        });
      }
    });
  };

  private removeListener = () => {
    this.adapter.removePlayBackListener();
  };

  public requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      if (Platform.Version > 32) return true;

      const { READ_EXTERNAL_STORAGE } = this.permissionModule.PERMISSIONS.ANDROID;

      const status = await this.permissionModule.check(READ_EXTERNAL_STORAGE);
      if (status === 'granted') {
        return true;
      } else {
        const status = await this.permissionModule.request(READ_EXTERNAL_STORAGE);
        return status === 'granted';
      }
    } else {
      return true;
    }
  };

  public addPlaybackListener = (callback: PlaybackListener): Unsubscribe => {
    this.playbackSubscribers.add(callback);
    return () => {
      this.playbackSubscribers.delete(callback);
    };
  };

  public addStateListener = (callback: (state: PlayerServiceInterface['state']) => void): Unsubscribe => {
    this.stateSubscribers.add(callback);
    return () => {
      this.stateSubscribers.delete(callback);
    };
  };

  public play = async (uri: string): Promise<void> => {
    if (matchesOneOf(this.state, ['idle', 'stopped'])) {
      try {
        this.setState('preparing');
        this.uri = uri;
        this.setListener();

        // FIXME: Workaround, `module.startPlayer()` caused a significant frame-drop and prevented the 'preparing' UI transition.
        await sleep(0);
        await this.adapter.startPlayer(uri);

        this.setState('playing');
      } catch (e) {
        this.setState('idle');
        this.uri = undefined;
        this.removeListener();
        throw e;
      }
    } else if (matchesOneOf(this.state, ['paused']) && this.uri === uri) {
      try {
        this.setListener();
        await this.adapter.resumePlayer();
        this.setState('playing');
      } catch (e) {
        this.removeListener();
        throw e;
      }
    }
  };

  public pause = async (): Promise<void> => {
    if (matchesOneOf(this.state, ['playing'])) {
      await this.adapter.pausePlayer();
      this.removeListener();
      this.setState('paused');
    }
  };

  public stop = async (): Promise<void> => {
    if (matchesOneOf(this.state, ['preparing', 'playing', 'paused'])) {
      await this.adapter.stopPlayer();
      this.removeListener();
      this.setState('stopped');
    }
  };

  public reset = async (): Promise<void> => {
    await this.stop();
    this.setState('idle');
    this.uri = undefined;
    this.playbackSubscribers.clear();
    this.stateSubscribers.clear();
  };

  public seek = async (time: number): Promise<void> => {
    if (matchesOneOf(this.state, ['playing', 'paused'])) {
      await this.adapter.seekToPlayer(time);
    }
  };
}

const createNativePlayerService = (modules: Modules): PlayerServiceInterface => {
  const adapter = isNitroSoundOrLegacyV4Module(modules.audioRecorderModule)
    ? new NitroSoundOrLegacyV4Adapter(modules.audioRecorderModule)
    : new AudioRecorderPlayerAdapter(modules.audioRecorderModule as typeof LegacyModule);

  return new VoicePlayer(adapter, modules.permissionModule);
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

export default createNativePlayerService;
