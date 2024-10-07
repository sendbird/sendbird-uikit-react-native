import type * as ExpoAV from 'expo-av';

import { Logger, matchesOneOf } from '@sendbird/uikit-utils';

import expoPermissionGranted from '../utils/expoPermissionGranted';
import type { PlayerServiceInterface, Unsubscribe } from './types';

type Modules = {
  avModule: typeof ExpoAV;
};
type PlaybackListener = Parameters<PlayerServiceInterface['addPlaybackListener']>[number];
type StateListener = Parameters<PlayerServiceInterface['addStateListener']>[number];
const createExpoPlayerService = ({ avModule }: Modules): PlayerServiceInterface => {
  const sound = new avModule.Audio.Sound();

  class VoicePlayer implements PlayerServiceInterface {
    uri?: string;
    state: PlayerServiceInterface['state'] = 'idle';

    private readonly playbackSubscribers = new Set<PlaybackListener>();
    private readonly stateSubscribers = new Set<StateListener>();

    private setState = (state: PlayerServiceInterface['state']) => {
      this.state = state;
      this.stateSubscribers.forEach((callback) => {
        callback(state);
      });
    };

    private setListener = () => {
      sound.setProgressUpdateIntervalAsync(100).catch((error) => {
        Logger.warn('[PlayerService.Expo] Failed to set progress update interval', error);
      });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            this.stop().catch((error) => {
              Logger.warn('[PlayerService.Expo] Failed to stop in OnPlaybackStatusUpdate', error);
            });
          }
          if (status.isPlaying) {
            this.playbackSubscribers.forEach((callback) => {
              callback({
                currentTime: status.positionMillis,
                duration: status.durationMillis ?? 0,
                stopped: status.didJustFinish,
              });
            });
          }
        }
      });
    };

    private removeListener = () => {
      sound.setOnPlaybackStatusUpdate(null);
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

    private prepare = async (uri: string) => {
      this.setState('preparing');
      await sound.loadAsync({ uri }, { shouldPlay: false }, true);
      this.uri = uri;
    };

    public play = async (uri: string): Promise<void> => {
      if (matchesOneOf(this.state, ['idle', 'stopped'])) {
        try {
          await this.prepare(uri);
          this.setListener();
          await sound.playAsync();
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
          await sound.playAsync();
          this.setState('playing');
        } catch (e) {
          this.removeListener();
          throw e;
        }
      }
    };

    public pause = async (): Promise<void> => {
      if (matchesOneOf(this.state, ['playing'])) {
        await sound.pauseAsync();
        this.removeListener();
        this.setState('paused');
      }
    };

    public stop = async (): Promise<void> => {
      if (matchesOneOf(this.state, ['playing', 'paused'])) {
        await sound.stopAsync();
        await sound.unloadAsync();
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
        await sound.playFromPositionAsync(time);
      }
    };
  }

  return new VoicePlayer();
};

export default createExpoPlayerService;
