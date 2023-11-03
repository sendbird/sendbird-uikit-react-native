import { Platform } from 'react-native';
import type * as RNAudioRecorder from 'react-native-audio-recorder-player';
import * as Permissions from 'react-native-permissions';

import { matchesOneOf, sleep } from '@sendbird/uikit-utils';

import type { PlayerServiceInterface, Unsubscribe } from './types';

type Modules = {
  audioRecorderModule: typeof RNAudioRecorder;
  permissionModule: typeof Permissions;
};
type PlaybackListener = Parameters<PlayerServiceInterface['addPlaybackListener']>[number];
type StateListener = Parameters<PlayerServiceInterface['addStateListener']>[number];
const createNativePlayerService = ({ audioRecorderModule, permissionModule }: Modules): PlayerServiceInterface => {
  const module = new audioRecorderModule.default();

  class VoicePlayer implements PlayerServiceInterface {
    uri?: string;
    state: PlayerServiceInterface['state'] = 'idle';

    private readonly playbackSubscribers = new Set<PlaybackListener>();
    private readonly stateSubscribers = new Set<StateListener>();

    constructor() {
      module.setSubscriptionDuration(0.1);
    }

    private setState = (state: PlayerServiceInterface['state']) => {
      this.state = state;
      this.stateSubscribers.forEach((callback) => {
        callback(state);
      });
    };

    private setListener = () => {
      module.addPlayBackListener((data) => {
        const stopped = data.currentPosition >= data.duration;

        if (stopped) this.stop();
        if (this.state === 'playing') {
          this.playbackSubscribers.forEach((callback) => {
            callback({ currentTime: data.currentPosition, duration: data.duration, stopped });
          });
        }
      });
    };

    private removeListener = () => {
      module.removePlayBackListener();
    };

    public requestPermission = async (): Promise<boolean> => {
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
          await module.startPlayer(uri);

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
          await module.resumePlayer();
          this.setState('playing');
        } catch (e) {
          this.removeListener();
          throw e;
        }
      }
    };

    public pause = async (): Promise<void> => {
      if (matchesOneOf(this.state, ['playing'])) {
        await module.pausePlayer();
        this.removeListener();
        this.setState('paused');
      }
    };

    public stop = async (): Promise<void> => {
      if (matchesOneOf(this.state, ['preparing', 'playing', 'paused'])) {
        await module.stopPlayer();
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
        await module.seekToPlayer(time);
      }
    };
  }

  return new VoicePlayer();
};

export default createNativePlayerService;
