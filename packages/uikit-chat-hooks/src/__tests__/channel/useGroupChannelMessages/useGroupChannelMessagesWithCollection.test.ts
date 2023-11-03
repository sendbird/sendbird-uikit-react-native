import { act, renderHook, waitFor } from '@testing-library/react-native';

import { createMockMessageCollection, createMockSendbirdChat } from '@sendbird/uikit-testing-tools';

import { useGroupChannelMessagesWithCollection } from '../../../channel/useGroupChannelMessages/useGroupChannelMessagesWithCollection';

describe('useGroupChannelMessagesWithCollection', () => {
  it('should initialize and return default value', async () => {
    const sdk = createMockSendbirdChat();
    const channel = await sdk.groupChannel.getChannel('channel-1');

    const { result } = renderHook(() => useGroupChannelMessagesWithCollection(sdk, channel, sdk.currentUser?.userId));

    expect(result.current.loading).toBe(true);
    expect(result.current.refreshing).toBe(false);
    expect(result.current.messages).toEqual([]);
    expect(result.current.newMessages).toEqual([]);
    expect(result.current.next).toBeInstanceOf(Function);
    expect(result.current.refresh).toBeInstanceOf(Function);

    await waitFor(() => {
      expect(channel.createMessageCollection).toHaveBeenCalled();
    });
  });

  it('should use collectionCreator when creating collection', async () => {
    const sdk = createMockSendbirdChat();
    const channel = await sdk.groupChannel.getChannel('channel-1');

    const collectionParams = { limit: 5, startingPoint: 10 };
    const options = {
      collectionCreator: jest.fn(() => channel.createMessageCollection(collectionParams)),
    };

    renderHook(() => useGroupChannelMessagesWithCollection(sdk, channel, sdk.currentUser?.userId, options));

    await waitFor(() => {
      expect(options.collectionCreator).toHaveBeenCalled();
      expect(channel.createMessageCollection).toHaveBeenCalledWith(collectionParams);
    });
  });

  it('should refresh collection', async () => {
    const sdk = createMockSendbirdChat();
    const groupChannel = await sdk.groupChannel.getChannel('channel-1');

    const collection = createMockMessageCollection({ sdk, groupChannel });
    const collectionCreator = jest.fn(() => collection.asMessageCollection());

    const { result } = renderHook(() =>
      useGroupChannelMessagesWithCollection(sdk, groupChannel, sdk.currentUser?.userId, { collectionCreator }),
    );

    await waitFor(() => {
      expect(result.current.refreshing).toBe(false);
      expect(collectionCreator).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.refresh();
    });
    expect(result.current.refreshing).toBe(true);

    await waitFor(() => {
      expect(collection.dispose).toHaveBeenCalled();
      expect(result.current.refreshing).toBe(false);
      expect(collectionCreator).toHaveBeenCalledTimes(2);
    });
  });

  it('should call collection.dispose when unmounting', async () => {
    const sdk = createMockSendbirdChat();
    const channel = await sdk.groupChannel.getChannel('channel-1');

    const collection = channel.createMessageCollection();
    const collectionCreator = jest.fn(() => collection);

    const { unmount } = renderHook(() =>
      useGroupChannelMessagesWithCollection(sdk, channel, sdk.currentUser?.userId, { collectionCreator }),
    );

    await waitFor(() => {
      expect(collection.dispose).not.toHaveBeenCalled();
    });

    await act(() => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          unmount();
          resolve();
        }, 5);
      });
    });

    await waitFor(() => {
      expect(collection.dispose).toHaveBeenCalled();
    });
  });

  it('should fetch prev group channels', async () => {
    const sdk = createMockSendbirdChat();
    const groupChannel = await sdk.groupChannel.getChannel('channel-1');
    const fetchableCollection = createMockMessageCollection({ sdk, groupChannel, limit: 10 });

    const { result } = renderHook(() =>
      useGroupChannelMessagesWithCollection(sdk, groupChannel, sdk.currentUser?.userId, {
        collectionCreator: () => fetchableCollection.asMessageCollection(),
      }),
    );

    await waitFor(() => {
      expect(fetchableCollection.initialize).toHaveBeenCalledTimes(1);
      expect(result.current.messages).not.toEqual([]); // wait onCacheResult
    });

    act(() => {
      result.current.prev();
    });

    await waitFor(() => {
      expect(fetchableCollection.loadPrevious).toHaveBeenCalledTimes(1);
    });
  });

  it('should not fetch next group channels when there are no more channels to fetch', async () => {
    const sdk = createMockSendbirdChat();
    const groupChannel = await sdk.groupChannel.getChannel('channel-1');
    const unFetchableCollection = createMockMessageCollection({ sdk, groupChannel, limit: 10, dataLength: 10 });

    const { result } = renderHook(() =>
      useGroupChannelMessagesWithCollection(sdk, groupChannel, sdk.currentUser?.userId, {
        collectionCreator: () => unFetchableCollection.asMessageCollection(),
      }),
    );

    await waitFor(() => {
      expect(unFetchableCollection.initialize).toHaveBeenCalledTimes(1);
      expect(result.current.messages).not.toEqual([]); // wait onCacheResult
    });

    act(() => {
      result.current.prev();
    });

    await waitFor(() => {
      expect(unFetchableCollection.loadPrevious).not.toHaveBeenCalled();
    });
  });
});
