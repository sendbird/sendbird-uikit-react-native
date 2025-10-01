import type * as ExpoAudio from 'expo-audio';
import type * as ExpoAV from 'expo-av';

import { Logger, matchesOneOf } from '@sendbird/uikit-utils';

import expoBackwardUtils from '../utils/expoBackwardUtils';
import type { ExpoAudioModule } from '../utils/expoBackwardUtils';
import type { PlayerServiceInterface, Unsubscribe } from './types';

type Modules = {
  avModule: ExpoAudioModule;
};
type PlaybackListener = Parameters<PlayerServiceInterface['addPlaybackListener']>[number];
type StateListener = Parameters<PlayerServiceInterface['addStateListener']>[number];

interface AudioPlayerAdapter {
  requestPermission(): Promise<boolean>;
  play(uri: string): Promise<void>;
  pause(): Promise<void>;
  stop(): Promise<void>;
  reset(): Promise<void>;
  seek(time: number): Promise<void>;
  addPlaybackListener(callback: PlaybackListener): Unsubscribe;
  addStateListener(callback: StateListener): Unsubscribe;
  readonly state: PlayerServiceInterface['state'];
  uri?: string;
}

abstract class BaseAudioPlayerAdapter implements AudioPlayerAdapter {
  uri?: string;
  state: PlayerServiceInterface['state'] = 'idle';

  protected readonly playbackSubscribers = new Set<PlaybackListener>();
  protected readonly stateSubscribers = new Set<StateListener>();

  protected setState = (state: PlayerServiceInterface['state']) => {
    this.state = state;
    this.stateSubscribers.forEach((callback) => {
      callback(state);
    });
  };

  public requestPermission = async (): Promise<boolean> => {
    return true;
  };

  public addPlaybackListener = (callback: PlaybackListener): Unsubscribe => {
    this.playbackSubscribers.add(callback);
    return () => {
      this.playbackSubscribers.delete(callback);
    };
  };

  public addStateListener = (callback: StateListener): Unsubscribe => {
    this.stateSubscribers.add(callback);
    return () => {
      this.stateSubscribers.delete(callback);
    };
  };

  abstract play(uri: string): Promise<void>;
  abstract pause(): Promise<void>;
  abstract stop(): Promise<void>;
  abstract reset(): Promise<void>;
  abstract seek(time: number): Promise<void>;
}

class LegacyExpoAVPlayerAdapter extends BaseAudioPlayerAdapter {
  private readonly sound: ExpoAV.Audio.Sound;

  constructor(avModule: typeof ExpoAV) {
    super();
    this.sound = new avModule.Audio.Sound();
  }

  private setListener = () => {
    this.sound.setProgressUpdateIntervalAsync(100).catch((error) => {
      Logger.warn('[PlayerService.Expo] Failed to set progress update interval', error);
    });
    this.sound.setOnPlaybackStatusUpdate((status) => {
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
    this.sound.setOnPlaybackStatusUpdate(null);
  };

  private prepare = async (uri: string) => {
    this.setState('preparing');
    await this.sound.loadAsync({ uri }, { shouldPlay: false }, true);
    this.uri = uri;
  };

  public play = async (uri: string): Promise<void> => {
    if (matchesOneOf(this.state, ['idle', 'stopped'])) {
      try {
        await this.prepare(uri);
        this.setListener();
        await this.sound.playAsync();
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
        await this.sound.playAsync();
        this.setState('playing');
      } catch (e) {
        this.removeListener();
        throw e;
      }
    }
  };

  public pause = async (): Promise<void> => {
    if (matchesOneOf(this.state, ['playing'])) {
      await this.sound.pauseAsync();
      this.removeListener();
      this.setState('paused');
    }
  };

  public stop = async (): Promise<void> => {
    if (matchesOneOf(this.state, ['playing', 'paused'])) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
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
      await this.sound.playFromPositionAsync(time);
    }
  };
}

class ExpoAudioPlayerAdapter extends BaseAudioPlayerAdapter {
  private readonly audioModule: typeof ExpoAudio;
  private player: ExpoAudio.AudioPlayer | null = null;

  constructor(audioModule: typeof ExpoAudio) {
    super();
    this.audioModule = audioModule;
  }

  private setListener = () => {
    if (!this.player) return;

    this.player.addListener('playbackStatusUpdate', (status) => {
      if (status.isLoaded) {
        if (status.didJustFinish) {
          this.stop().catch((error) => {
            Logger.warn('[PlayerService.Expo] Failed to stop in playbackStatusUpdate', error);
          });
        }
        if (status.playing) {
          this.playbackSubscribers.forEach((callback) => {
            callback({
              currentTime: status.currentTime,
              duration: status.duration ?? 0,
              stopped: status.didJustFinish,
            });
          });
        }
      }
    });
  };

  private removeListener = () => {
    if (this.player) {
      this.player.remove();
    }
  };

  private prepare = async (uri: string) => {
    this.setState('preparing');
    this.player = this.audioModule.createAudioPlayer(uri, { updateInterval: 100 });
    this.uri = uri;
  };

  public play = async (uri: string): Promise<void> => {
    if (matchesOneOf(this.state, ['idle', 'stopped'])) {
      try {
        await this.prepare(uri);
        this.setListener();
        this.player?.play();
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
        this.player?.play();
        this.setState('playing');
      } catch (e) {
        this.removeListener();
        throw e;
      }
    }
  };

  public pause = async (): Promise<void> => {
    if (matchesOneOf(this.state, ['playing'])) {
      this.player?.pause();
      this.removeListener();
      this.setState('paused');
    }
  };

  public stop = async (): Promise<void> => {
    if (matchesOneOf(this.state, ['playing', 'paused'])) {
      this.player?.pause();
      this.removeListener();
      this.setState('stopped');
    }
  };

  public reset = async (): Promise<void> => {
    await this.stop();
    this.player?.remove();
    this.player = null;
    this.setState('idle');
    this.uri = undefined;
    this.playbackSubscribers.clear();
    this.stateSubscribers.clear();
  };

  public seek = async (time: number): Promise<void> => {
    if (matchesOneOf(this.state, ['playing', 'paused']) && this.player) {
      this.player.currentTime = time;
    }
  };
}

const createExpoPlayerService = ({ avModule }: Modules): PlayerServiceInterface => {
  if (expoBackwardUtils.expoAV.isLegacyAVModule(avModule)) {
    Logger.warn(
      '[PlayerService.Expo] expo-av is deprecated and will be removed in Expo 54. Please migrate to expo-audio.',
    );
  }

  const audioAdapter = expoBackwardUtils.expoAV.isAudioModule(avModule)
    ? new ExpoAudioPlayerAdapter(avModule)
    : new LegacyExpoAVPlayerAdapter(avModule as typeof ExpoAV);

  return {
    get uri() {
      return audioAdapter.uri;
    },
    get state() {
      return audioAdapter.state;
    },
    requestPermission: audioAdapter.requestPermission.bind(audioAdapter),
    addPlaybackListener: audioAdapter.addPlaybackListener.bind(audioAdapter),
    addStateListener: audioAdapter.addStateListener.bind(audioAdapter),
    play: audioAdapter.play.bind(audioAdapter),
    pause: audioAdapter.pause.bind(audioAdapter),
    stop: audioAdapter.stop.bind(audioAdapter),
    reset: audioAdapter.reset.bind(audioAdapter),
    seek: audioAdapter.seek.bind(audioAdapter),
  };
};

export default createExpoPlayerService;
