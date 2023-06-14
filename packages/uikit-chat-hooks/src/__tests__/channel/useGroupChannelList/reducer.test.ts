import { act, renderHook, waitFor } from '@testing-library/react-native';

import { ChannelType } from '@sendbird/chat';
import { createMockChannel, createMockMessage } from '@sendbird/uikit-testing-tools';

import { useGroupChannelListReducer } from '../../../channel/useGroupChannelList/reducer';

describe('useGroupChannelListReducer', () => {
  it('should return the correct initial state', () => {
    const { result } = renderHook(() => useGroupChannelListReducer());

    expect(result.current.groupChannels).toEqual([]);
    expect(result.current.loading).toEqual(true);
    expect(result.current.refreshing).toEqual(false);
    expect(result.current.appendChannels).toBeInstanceOf(Function);
    expect(result.current.deleteChannels).toBeInstanceOf(Function);
    expect(result.current.updateOrder).toBeInstanceOf(Function);
    expect(result.current.updateChannels).toBeInstanceOf(Function);
    expect(result.current.updateLoading).toBeInstanceOf(Function);
    expect(result.current.updateRefreshing).toBeInstanceOf(Function);
  });

  it('should return the correct state after updateLoading', async () => {
    const { result } = renderHook(() => useGroupChannelListReducer());

    expect(result.current.loading).toEqual(true);

    act(() => {
      result.current.updateLoading(false);
    });

    await waitFor(() => {
      expect(result.current.loading).toEqual(false);
    });
  });

  it('should return the correct state after updateRefreshing', async () => {
    const { result } = renderHook(() => useGroupChannelListReducer());

    expect(result.current.refreshing).toEqual(false);

    act(() => {
      result.current.updateRefreshing(true);
    });

    await waitFor(() => {
      expect(result.current.refreshing).toEqual(true);
    });
  });

  it('should return the correct state after appendChannels without clearBeforeAction', async () => {
    const { result } = renderHook(() => useGroupChannelListReducer());

    const channels = [
      createMockChannel({ channelType: ChannelType.GROUP, url: 'channel_url_1' }),
      createMockChannel({ channelType: ChannelType.GROUP, url: 'channel_url_2' }),
    ];
    const appendedChannels = [
      createMockChannel({ channelType: ChannelType.GROUP, url: 'channel_url_1' }),
      createMockChannel({ channelType: ChannelType.GROUP, url: 'channel_url_3' }),
    ];

    act(() => {
      result.current.appendChannels(channels, true);
    });
    await waitFor(() => {
      expect(result.current.groupChannels).toEqual(channels);
    });

    act(() => {
      result.current.appendChannels(appendedChannels, false);
    });
    await waitFor(() => {
      expect(result.current.groupChannels).toEqual([channels[0], channels[1], appendedChannels[1]]);
    });
  });

  it('should return the correct state after setChannels with clearBeforeAction', async () => {
    const { result } = renderHook(() => useGroupChannelListReducer());

    const channels = [
      createMockChannel({ channelType: ChannelType.GROUP, url: 'channel_url_1' }),
      createMockChannel({ channelType: ChannelType.GROUP, url: 'channel_url_2' }),
    ];
    const appendedChannel = createMockChannel({ channelType: ChannelType.GROUP, url: 'channel_url_3' });

    act(() => {
      result.current.appendChannels(channels, true);
    });
    await waitFor(() => {
      expect(result.current.groupChannels).toEqual(channels);
    });

    act(() => {
      result.current.appendChannels([appendedChannel], true);
    });
    await waitFor(() => {
      expect(result.current.groupChannels).toEqual([appendedChannel]);
    });
  });

  it('should return the correct state after updateChannels', async () => {
    const { result } = renderHook(() => useGroupChannelListReducer());

    const channels = [
      createMockChannel({ channelType: ChannelType.GROUP, url: 'channel_url_1', coverUrl: 'cover-1-a' }),
      createMockChannel({ channelType: ChannelType.GROUP, url: 'channel_url_2', coverUrl: 'cover-2-a' }),
    ];
    const validUpdatedChannels = [
      createMockChannel({ channelType: ChannelType.GROUP, url: 'channel_url_1', coverUrl: 'cover-1-b' }),
      createMockChannel({ channelType: ChannelType.GROUP, url: 'channel_url_2', coverUrl: 'cover-2-b' }),
    ];
    const invalidUpdatedChannels = [
      createMockChannel({ channelType: ChannelType.GROUP, url: 'channel_url_3', coverUrl: 'cover-3-b' }),
      createMockChannel({ channelType: ChannelType.OPEN, url: 'channel_url_4', coverUrl: 'cover-4-b' }),
    ];

    act(() => {
      result.current.appendChannels(channels, true);
    });
    await waitFor(() => {
      expect(result.current.groupChannels).toEqual(channels);
    });

    act(() => {
      result.current.updateChannels([...validUpdatedChannels, ...invalidUpdatedChannels]);
    });
    await waitFor(() => {
      expect(result.current.groupChannels).toEqual(validUpdatedChannels);
    });
  });

  it('should return the correct state after deleteChannels', async () => {
    const { result } = renderHook(() => useGroupChannelListReducer());

    const channels = [
      createMockChannel({ channelType: ChannelType.GROUP, url: 'channel_url_1', coverUrl: 'cover-1-a' }),
      createMockChannel({ channelType: ChannelType.GROUP, url: 'channel_url_2', coverUrl: 'cover-2-a' }),
    ];
    const validDeletedChannelIds = [channels[0].url];

    act(() => {
      result.current.appendChannels(channels, true);
    });
    await waitFor(() => {
      expect(result.current.groupChannels).toEqual(channels);
    });

    act(() => {
      result.current.deleteChannels(validDeletedChannelIds);
    });
    await waitFor(() => {
      expect(result.current.groupChannels).toEqual([channels[1]]);
    });
  });

  it('should return the correct state after updateOrder', async () => {
    const { result } = renderHook(() => useGroupChannelListReducer());

    const channels = [
      createMockChannel({
        channelType: ChannelType.GROUP,
        name: 'B',
        url: 'channel_url_2',
        coverUrl: 'cover-2',
        lastMessage: createMockMessage({ createdAt: 1 }),
      }),
      createMockChannel({
        channelType: ChannelType.GROUP,
        name: 'D',
        url: 'channel_url_4',
        coverUrl: 'cover-4',
        lastMessage: undefined,
      }),
      createMockChannel({
        channelType: ChannelType.GROUP,
        name: 'C',
        url: 'channel_url_3',
        coverUrl: 'cover-3',
        lastMessage: undefined,
      }),
      createMockChannel({
        channelType: ChannelType.GROUP,
        name: 'A',
        url: 'channel_url_1',
        coverUrl: 'cover-1',
        lastMessage: createMockMessage({ createdAt: 2 }),
      }),
    ];

    act(() => {
      result.current.appendChannels(channels, true);
    });
    await waitFor(() => {
      expect(result.current.groupChannels).toEqual(channels);
    });

    act(() => {
      result.current.updateOrder('metadata_value_alphabetical');
    });
    await waitFor(() => {
      expect(result.current.groupChannels).toEqual(channels);
    });

    act(() => {
      result.current.updateOrder('channel_name_alphabetical');
    });
    await waitFor(() => {
      expect(result.current.groupChannels).toEqual([channels[3], channels[0], channels[2], channels[1]]);
    });

    act(() => {
      result.current.updateOrder('chronological');
    });
    await waitFor(() => {
      expect(result.current.groupChannels).toEqual([channels[3], channels[2], channels[1], channels[0]]);
    });

    act(() => {
      result.current.updateOrder('latest_last_message');
    });
    await waitFor(() => {
      expect(result.current.groupChannels).toEqual([channels[3], channels[0], channels[2], channels[1]]);
    });
  });
});
