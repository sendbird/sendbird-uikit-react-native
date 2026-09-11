import createExpoPlayerService from '../../platform/createPlayerService.expo';
import type { PlayerServiceInterface } from '../../platform/types';

const URI_A = 'voice-a.m4a';
const URI_B = 'voice-b.m4a';

type FakePlaybackStatus = {
  isLoaded: boolean;
  playing: boolean;
  didJustFinish: boolean;
  currentTime: number;
  duration: number;
};

type FakePlaybackListener = (status: FakePlaybackStatus) => void;
type FakeSubscription = { remove: jest.Mock };

const createStatus = (status: Partial<FakePlaybackStatus> = {}): FakePlaybackStatus => ({
  isLoaded: true,
  playing: true,
  didJustFinish: false,
  currentTime: 0,
  duration: 0,
  ...status,
});

class FakeAudioPlayer {
  public position = 0;
  public readonly play = jest.fn();
  public readonly pause = jest.fn();
  public readonly remove = jest.fn();
  public readonly seekTo = jest.fn(async (seconds: number) => {
    this.position = seconds;
  });

  public readonly subscriptions: FakeSubscription[] = [];
  private readonly listeners = new Set<FakePlaybackListener>();

  constructor(public readonly uri: string) {
    Object.defineProperty(this, 'currentTime', {
      enumerable: true,
      configurable: false,
      get: () => this.position,
      set: () => {
        throw new TypeError("Cannot assign to property 'currentTime' which has only a getter");
      },
    });
  }

  public readonly addListener = jest.fn((eventName: string, listener: FakePlaybackListener): FakeSubscription => {
    if (eventName === 'playbackStatusUpdate') this.listeners.add(listener);

    const subscription: FakeSubscription = {
      remove: jest.fn(() => {
        this.listeners.delete(listener);
      }),
    };
    this.subscriptions.push(subscription);
    return subscription;
  });

  public emit(status: Partial<FakePlaybackStatus> = {}) {
    [...this.listeners].forEach((listener) => listener(createStatus(status)));
  }

  public get listenerCount() {
    return this.listeners.size;
  }
}

const setup = () => {
  const players: FakeAudioPlayer[] = [];
  const createAudioPlayer = jest.fn((uri: string) => {
    const player = new FakeAudioPlayer(uri);
    players.push(player);
    return player;
  });

  const audioModule = {
    // `expoBackwardUtils.expoAV.isAudioModule` detects the expo-audio module by this key.
    useAudioRecorder: jest.fn(),
    createAudioPlayer,
  };

  const service: PlayerServiceInterface = createExpoPlayerService({ avModule: audioModule as never });

  return {
    service,
    players,
    createAudioPlayer,
    playerAt: (index: number) => players[index],
    lastPlayer: () => players[players.length - 1],
  };
};

describe('createExpoPlayerService - expo-audio adapter', () => {
  it('seeks through seekTo() with seconds instead of assigning to the read-only currentTime', async () => {
    const { service, lastPlayer } = setup();

    await service.play(URI_A);
    await service.seek(1500);

    expect(lastPlayer().seekTo).toHaveBeenCalledWith(1.5);
    expect(lastPlayer().position).toBe(1.5);
  });

  it('does not seek when the player is idle', async () => {
    const { service, players } = setup();

    await service.seek(1500);

    expect(players).toHaveLength(0);
  });

  it('reports playback time in milliseconds', async () => {
    const { service, lastPlayer } = setup();
    const onPlayback = jest.fn();

    await service.play(URI_A);
    service.addPlaybackListener(onPlayback);
    lastPlayer().emit({ currentTime: 1.5, duration: 3 });

    expect(onPlayback).toHaveBeenCalledWith({ currentTime: 1500, duration: 3000, stopped: false });
  });

  it('reports a zero duration in milliseconds while the player is still loading', async () => {
    const { service, lastPlayer } = setup();
    const onPlayback = jest.fn();

    await service.play(URI_A);
    service.addPlaybackListener(onPlayback);
    lastPlayer().emit({ currentTime: 0, duration: 0 });

    expect(onPlayback).toHaveBeenCalledWith({ currentTime: 0, duration: 0, stopped: false });
  });

  it('detaches the status subscription on pause without releasing the player', async () => {
    const { service, lastPlayer } = setup();

    await service.play(URI_A);
    await service.pause();

    expect(lastPlayer().pause).toHaveBeenCalled();
    expect(lastPlayer().subscriptions[0].remove).toHaveBeenCalled();
    expect(lastPlayer().remove).not.toHaveBeenCalled();
  });

  it('does not stack status subscriptions across pause and resume', async () => {
    const { service, lastPlayer } = setup();
    const onPlayback = jest.fn();

    await service.play(URI_A);
    service.addPlaybackListener(onPlayback);
    await service.pause();
    await service.play(URI_A);
    lastPlayer().emit({ currentTime: 1, duration: 3 });

    expect(lastPlayer().listenerCount).toBe(1);
    expect(onPlayback).toHaveBeenCalledTimes(1);
  });

  it('releases the previous player when a new one is prepared', async () => {
    const { service, playerAt, players } = setup();

    await service.play(URI_A);
    await service.stop();
    await service.play(URI_B);

    expect(players).toHaveLength(2);
    expect(playerAt(0).remove).toHaveBeenCalledTimes(1);
    expect(playerAt(1).remove).not.toHaveBeenCalled();
  });

  it('releases the player on reset', async () => {
    const { service, lastPlayer } = setup();

    await service.play(URI_A);
    await service.reset();

    expect(lastPlayer().remove).toHaveBeenCalled();
    expect(service.state).toBe('idle');
    expect(service.uri).toBeUndefined();
  });

  it('stops and reports the finished state when playback reaches the end', async () => {
    const { service, lastPlayer } = setup();
    const onPlayback = jest.fn();
    const onState = jest.fn();

    await service.play(URI_A);
    service.addPlaybackListener(onPlayback);
    service.addStateListener(onState);
    lastPlayer().emit({ currentTime: 3, duration: 3, didJustFinish: true });

    expect(onPlayback).toHaveBeenCalledWith({ currentTime: 3000, duration: 3000, stopped: true });
    expect(onState).toHaveBeenCalledWith('stopped');
    expect(service.state).toBe('stopped');
  });

  it('ignores status updates while the player is paused', async () => {
    const { service, lastPlayer } = setup();
    const onPlayback = jest.fn();

    await service.play(URI_A);
    service.addPlaybackListener(onPlayback);
    lastPlayer().emit({ playing: false, currentTime: 1, duration: 3 });

    expect(onPlayback).not.toHaveBeenCalled();
  });
});
