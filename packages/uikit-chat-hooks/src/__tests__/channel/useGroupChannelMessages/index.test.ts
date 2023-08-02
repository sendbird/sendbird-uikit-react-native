import { renderHook, waitFor } from '@testing-library/react-native';

import { createMockSendbirdChat } from '@sendbird/uikit-testing-tools';

import { useGroupChannelMessages } from '../../../channel/useGroupChannelMessages';
import { useGroupChannelMessagesWithCollection } from '../../../channel/useGroupChannelMessages/useGroupChannelMessagesWithCollection';
import { useGroupChannelMessagesWithQuery } from '../../../channel/useGroupChannelMessages/useGroupChannelMessagesWithQuery';

jest.mock('../../../channel/useGroupChannelMessages/useGroupChannelMessagesWithCollection', () => ({
  useGroupChannelMessagesWithCollection: jest.fn(),
}));

jest.mock('../../../channel/useGroupChannelMessages/useGroupChannelMessagesWithQuery', () => ({
  useGroupChannelMessagesWithQuery: jest.fn(),
}));

describe('useGroupChannelMessages', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should mock useGroupChannelMessagesWithCollection', () => {
    expect(jest.isMockFunction(useGroupChannelMessagesWithCollection)).toBe(true);
  });

  it('should mock useGroupChannelMessagesWithQuery', () => {
    expect(jest.isMockFunction(useGroupChannelMessagesWithQuery)).toBe(true);
  });

  it('should call useGroupChannelMessagesWithCollection if the sdk.cacheEnabled is turned on', async () => {
    const sdk = createMockSendbirdChat({ localCacheEnabled: true });
    const channel = await sdk.groupChannel.getChannel('test-channel');
    const options = { collectionCreator: jest.fn() };

    renderHook(() => useGroupChannelMessages(sdk, channel, sdk.currentUser?.userId, options));

    await waitFor(() => {
      expect(useGroupChannelMessagesWithCollection).toHaveBeenCalledTimes(1);
    });
  });

  it('should call useGroupChannelMessagesWithCollection if the options.enableCollectionWithoutLocalCache is turned on', async () => {
    const sdk = createMockSendbirdChat({ localCacheEnabled: false });
    const channel = await sdk.groupChannel.getChannel('test-channel');
    const options = { collectionCreator: jest.fn(), enableCollectionWithoutLocalCache: true };

    renderHook(() => useGroupChannelMessages(sdk, channel, sdk.currentUser?.userId, options));

    await waitFor(() => {
      expect(useGroupChannelMessagesWithCollection).toHaveBeenCalledTimes(1);
    });
  });

  it('should call useGroupChannelMessagesWithCollection with the correct arguments', async () => {
    const sdk = createMockSendbirdChat({ localCacheEnabled: true });
    const channel = await sdk.groupChannel.getChannel('test-channel');
    const options = { collectionCreator: jest.fn() };

    renderHook(() => useGroupChannelMessages(sdk, channel, sdk.currentUser?.userId, options));

    await waitFor(() => {
      expect(useGroupChannelMessagesWithCollection).toHaveBeenCalledTimes(1);
      expect(useGroupChannelMessagesWithCollection).toHaveBeenCalledWith(
        sdk,
        channel,
        sdk.currentUser?.userId,
        options,
      );
    });
  });

  it('should call useGroupChannelMessagesWithQuery with the correct arguments', async () => {
    const sdk = createMockSendbirdChat({ localCacheEnabled: false });
    const channel = await sdk.groupChannel.getChannel('test-channel');
    const options = { queryCreator: jest.fn() };

    renderHook(() => useGroupChannelMessages(sdk, channel, sdk.currentUser?.userId, options));

    await waitFor(() => {
      expect(useGroupChannelMessagesWithQuery).toHaveBeenCalledTimes(1);
      expect(useGroupChannelMessagesWithQuery).toHaveBeenCalledWith(sdk, channel, sdk.currentUser?.userId, options);
    });
  });
});
