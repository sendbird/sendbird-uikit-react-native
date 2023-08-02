import { renderHook, waitFor } from '@testing-library/react-native';

import { createMockSendbirdChat } from '@sendbird/uikit-testing-tools';

import { useOpenChannelMessagesWithQuery } from '../../../channel/useOpenChannelMessages/useOpenChannelMessagesWithQuery';

describe('useOpenChannelMessagesWithQuery', () => {
  const sdk = createMockSendbirdChat({ testType: 'success', userId: 'user-id' });

  it('should initialize messages when entering channel', async () => {
    const channel = await sdk.openChannel.getChannel('channel-1');
    const { result } = renderHook(() =>
      useOpenChannelMessagesWithQuery(sdk, channel, sdk.currentUser?.userId, { onChannelDeleted: jest.fn() }),
    );

    await waitFor(() => {
      expect(channel.enter).toHaveBeenCalledTimes(1);
      expect(channel.createPreviousMessageListQuery).toHaveBeenCalledTimes(1);
      expect(result.current.loading).toBe(false);
      expect(result.current.refreshing).toBe(false);
      expect(result.current.messages).not.toEqual([]);
      expect(result.current.newMessages).toEqual([]);
      expect(result.current.prev).toBeInstanceOf(Function);
      expect(result.current.next).toBeInstanceOf(Function);
      expect(result.current.refresh).toBeInstanceOf(Function);
      expect(result.current.sendUserMessage).toBeInstanceOf(Function);
      expect(result.current.sendFileMessage).toBeInstanceOf(Function);
      expect(result.current.updateFileMessage).toBeInstanceOf(Function);
      expect(result.current.updateUserMessage).toBeInstanceOf(Function);
      expect(result.current.resendMessage).toBeInstanceOf(Function);
      expect(result.current.deleteMessage).toBeInstanceOf(Function);
    });
  });

  it('should use queryCreator when creating query', async () => {
    const channel = await sdk.openChannel.getChannel('channel-2');
    const queryParams = { limit: 20 };
    const options = { queryCreator: jest.fn(() => channel.createPreviousMessageListQuery(queryParams)) };

    const { result } = renderHook(() =>
      useOpenChannelMessagesWithQuery(sdk, channel, sdk.currentUser?.userId, options),
    );

    await waitFor(() => {
      expect(options.queryCreator).toHaveBeenCalled();
      expect(channel.createPreviousMessageListQuery).toHaveBeenCalledWith(queryParams);
      expect(result.current.loading).toBe(false);
      expect(result.current.refreshing).toBe(false);
      expect(result.current.messages).toHaveLength(queryParams.limit);
    });
  });

  it('should handle error when entering channel throws an error', async () => {
    const channel = await sdk.openChannel.getChannel('channel-3');
    const options = { onChannelDeleted: jest.fn(), onError: jest.fn() };
    channel.enter = jest.fn().mockRejectedValue(new Error('test-error'));

    renderHook(() => useOpenChannelMessagesWithQuery(sdk, channel, sdk.currentUser?.userId, options));

    await waitFor(() => {
      expect(channel.enter).toHaveBeenCalledTimes(1);
      expect(options.onError).toHaveBeenCalledWith(new Error('test-error'));
      expect(options.onChannelDeleted).toHaveBeenCalled();
    });
  });

  it('should handle onChannelDeleted callback when channel is deleted', async () => {
    const channel = await sdk.openChannel.getChannel('channel-4');
    const options = { onChannelDeleted: jest.fn(), onError: jest.fn() };

    renderHook(() => useOpenChannelMessagesWithQuery(sdk, channel, sdk.currentUser?.userId, options));

    sdk.__emit('channel', 'open_onChannelDeleted', channel.url, 'open');

    await waitFor(() => {
      expect(channel.enter).toHaveBeenCalled();
      expect(options.onError).not.toHaveBeenCalled();
      expect(options.onChannelDeleted).toHaveBeenCalled();
    });
  });
});
