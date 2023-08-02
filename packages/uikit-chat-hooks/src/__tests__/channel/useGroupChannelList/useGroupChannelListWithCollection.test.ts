import { act, renderHook, waitFor } from '@testing-library/react-native';

import { GroupChannelListOrder } from '@sendbird/chat/groupChannel';
import { createMockGroupChannelCollection, createMockSendbirdChat } from '@sendbird/uikit-testing-tools';

import { useGroupChannelListWithCollection } from '../../../channel/useGroupChannelList/useGroupChannelListWithCollection';

describe('useGroupChannelListWithCollection', () => {
  it('should initialize and return default value', async () => {
    const sdk = createMockSendbirdChat();

    const { result } = renderHook(() => useGroupChannelListWithCollection(sdk, sdk.currentUser?.userId));

    expect(result.current.loading).toBe(true);
    expect(result.current.refreshing).toBe(false);
    expect(result.current.groupChannels).toEqual([]);
    expect(result.current.next).toBeInstanceOf(Function);
    expect(result.current.refresh).toBeInstanceOf(Function);

    await waitFor(() => {
      expect(sdk.groupChannel.createGroupChannelCollection).toHaveBeenCalled();
    });
  });

  it('should use collectionCreator when creating collection', async () => {
    const sdk = createMockSendbirdChat();

    const collectionParams = { limit: 22, order: GroupChannelListOrder.LATEST_LAST_MESSAGE };
    const options = {
      collectionCreator: jest.fn(() => sdk.groupChannel.createGroupChannelCollection(collectionParams)),
    };

    renderHook(() => useGroupChannelListWithCollection(sdk, sdk.currentUser?.userId, options));

    await waitFor(() => {
      expect(options.collectionCreator).toHaveBeenCalled();
      expect(sdk.groupChannel.createGroupChannelCollection).toHaveBeenCalledWith(collectionParams);
    });
  });

  it('should refresh collection', async () => {
    const sdk = createMockSendbirdChat();

    const collection = createMockGroupChannelCollection({ sdk });
    const collectionCreator = jest.fn(() => collection);

    const { result } = renderHook(() =>
      useGroupChannelListWithCollection(sdk, sdk.currentUser?.userId, { collectionCreator }),
    );
    expect(result.current.refreshing).toBe(false);
    expect(collectionCreator).toHaveBeenCalledTimes(1);

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

    const collection = createMockGroupChannelCollection({ sdk });
    const collectionCreator = jest.fn(() => collection);

    const { unmount } = renderHook(() =>
      useGroupChannelListWithCollection(sdk, sdk.currentUser?.userId, { collectionCreator }),
    );

    unmount();

    await waitFor(() => {
      expect(collection.dispose).toHaveBeenCalled();
    });
  });

  it('should fetch next group channels', async () => {
    const sdk = createMockSendbirdChat();

    const fetchableCollection = createMockGroupChannelCollection({ sdk, limit: 10, hasMore: true });

    const { result } = renderHook(() =>
      useGroupChannelListWithCollection(sdk, sdk.currentUser?.userId, { collectionCreator: () => fetchableCollection }),
    );

    await waitFor(() => {
      expect(fetchableCollection.loadMore).toHaveBeenCalledTimes(1);
      expect(result.current.groupChannels).toHaveLength(10);
    });

    act(() => {
      result.current.next();
    });

    await waitFor(() => {
      expect(fetchableCollection.loadMore).toHaveBeenCalledTimes(2);
      expect(result.current.groupChannels).toHaveLength(20);
    });
  });

  it('should not fetch next group channels when there are no more channels to fetch', async () => {
    const sdk = createMockSendbirdChat();

    const unFetchableCollection = createMockGroupChannelCollection({ sdk, limit: 10, hasMore: false });

    const { result } = renderHook(() =>
      useGroupChannelListWithCollection(sdk, sdk.currentUser?.userId, {
        collectionCreator: () => unFetchableCollection,
      }),
    );

    await waitFor(() => {
      expect(result.current.groupChannels).toHaveLength(0);
      expect(unFetchableCollection.loadMore).not.toHaveBeenCalled();
    });

    act(() => {
      result.current.next();
    });

    await waitFor(() => {
      expect(result.current.groupChannels).toHaveLength(0);
      expect(unFetchableCollection.loadMore).not.toHaveBeenCalled();
    });
  });
});
