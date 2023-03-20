import { act, renderHook } from '@testing-library/react-native';

import { ChannelType } from '@sendbird/chat';
import { createMockChannel } from '@sendbird/uikit-testing-tools';

import { useOpenChannelListReducer } from '../../../channel/useOpenChannelList/reducer';

describe('useOpenChannelListReducer', () => {
  const mockChannels = [
    createMockChannel({ url: 'url-1', channelType: ChannelType.OPEN }),
    createMockChannel({ url: 'url-2', channelType: ChannelType.OPEN }),
    createMockChannel({ url: 'url-3', channelType: ChannelType.OPEN }),
  ];

  it('should update channels', () => {
    const { result } = renderHook(() => useOpenChannelListReducer());
    const updatedChannel = createMockChannel({
      url: mockChannels[0].url,
      channelType: ChannelType.OPEN,
      isFrozen: true,
      isEphemeral: true,
      coverUrl: 'cover-url',
    });

    act(() => {
      result.current.appendChannels(mockChannels, true);
      result.current.updateChannels([updatedChannel]);
    });

    expect(result.current.openChannels).not.toEqual(mockChannels);
    expect(result.current.openChannels).toEqual([updatedChannel, mockChannels[1], mockChannels[2]]);
  });

  it('should delete channels', () => {
    const { result } = renderHook(() => useOpenChannelListReducer());

    act(() => {
      result.current.appendChannels(mockChannels, true);
      result.current.deleteChannels([mockChannels[0].url, mockChannels[2].url]);
    });

    expect(result.current.openChannels).toEqual([mockChannels[1]]);
  });

  it('should append channels', () => {
    const { result } = renderHook(() => useOpenChannelListReducer());

    act(() => {
      result.current.appendChannels([mockChannels[0]], false);
    });

    expect(result.current.openChannels).toEqual([mockChannels[0]]);

    act(() => {
      result.current.appendChannels([mockChannels[1]], true);
    });

    expect(result.current.openChannels).toEqual([mockChannels[1]]);
  });

  it('should update loading and refreshing', () => {
    const { result } = renderHook(() => useOpenChannelListReducer());

    act(() => {
      result.current.updateLoading(true);
    });

    expect(result.current.loading).toBe(true);

    act(() => {
      result.current.updateRefreshing(true);
    });

    expect(result.current.refreshing).toBe(true);
  });

  it('should update error', () => {
    const error = new Error('An error occurred');
    const { result } = renderHook(() => useOpenChannelListReducer());

    act(() => {
      result.current.updateError(error);
    });

    expect(result.current.error).toBe(error);
  });
});
