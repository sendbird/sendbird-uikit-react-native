import { act, renderHook, waitFor } from '@testing-library/react-native';

import { GroupChannelListOrder, GroupChannelListQuery } from '@sendbird/chat/groupChannel';
import { createMockQuery, createMockSendbirdChat } from '@sendbird/uikit-testing-tools';

import { useGroupChannelListWithQuery } from '../../../channel/useGroupChannelList/useGroupChannelListWithQuery';

describe('useGroupChannelListWithQuery', () => {
  it('should initialize and return default value', async () => {
    const sdk = createMockSendbirdChat();

    const { result } = renderHook(() => useGroupChannelListWithQuery(sdk, sdk.currentUser?.userId));

    expect(result.current.loading).toBe(true);
    expect(result.current.refreshing).toBe(false);
    expect(result.current.groupChannels).toEqual([]);
    expect(result.current.next).toBeInstanceOf(Function);
    expect(result.current.refresh).toBeInstanceOf(Function);

    await waitFor(() => {
      expect(sdk.groupChannel.createMyGroupChannelListQuery).toHaveBeenCalled();
    });
  });

  it('should use queryCreator when creating query', async () => {
    const sdk = createMockSendbirdChat();

    const queryParams = { limit: 22, order: GroupChannelListOrder.LATEST_LAST_MESSAGE };
    const options = {
      queryCreator: jest.fn(() => sdk.groupChannel.createMyGroupChannelListQuery(queryParams)),
    };

    renderHook(() => useGroupChannelListWithQuery(sdk, sdk.currentUser?.userId, options));

    await waitFor(() => {
      expect(options.queryCreator).toHaveBeenCalled();
      expect(sdk.groupChannel.createMyGroupChannelListQuery).toHaveBeenCalledWith(queryParams);
    });
  });

  it('should refresh query', async () => {
    const sdk = createMockSendbirdChat();

    const query = createMockQuery({
      type: 'groupChannel',
      limit: 10,
      dataLength: 200,
      sdk,
    }) as unknown as GroupChannelListQuery;
    const queryCreator = jest.fn(() => query);

    const { result } = renderHook(() => useGroupChannelListWithQuery(sdk, sdk.currentUser?.userId, { queryCreator }));
    expect(result.current.refreshing).toBe(false);
    expect(queryCreator).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.refresh();
    });
    expect(result.current.refreshing).toBe(true);

    await waitFor(() => {
      expect(result.current.refreshing).toBe(false);
      expect(queryCreator).toHaveBeenCalledTimes(2);
    });
  });

  it('should fetch next group channels', async () => {
    const sdk = createMockSendbirdChat();
    const fetchableQuery = createMockQuery({
      type: 'groupChannel',
      limit: 10,
      dataLength: 200,
      sdk,
    }) as unknown as GroupChannelListQuery;

    const { result } = renderHook(() =>
      useGroupChannelListWithQuery(sdk, sdk.currentUser?.userId, { queryCreator: () => fetchableQuery }),
    );

    await waitFor(() => {
      expect(fetchableQuery.next).toHaveBeenCalledTimes(1);
      expect(result.current.groupChannels).toHaveLength(10);
    });

    act(() => {
      result.current.next();
    });

    await waitFor(() => {
      expect(fetchableQuery.next).toHaveBeenCalledTimes(2);
      expect(result.current.groupChannels).toHaveLength(20);
    });
  });

  it('should not fetch next group channels when there are no more channels to fetch', async () => {
    const sdk = createMockSendbirdChat();
    const unFetchableQuery = createMockQuery({
      type: 'groupChannel',
      limit: 10,
      dataLength: 0,
      sdk,
    }) as unknown as GroupChannelListQuery;

    const { result } = renderHook(() =>
      useGroupChannelListWithQuery(sdk, sdk.currentUser?.userId, { queryCreator: () => unFetchableQuery }),
    );

    await waitFor(() => {
      expect(result.current.groupChannels).toHaveLength(0);
      expect(unFetchableQuery.next).not.toHaveBeenCalled();
    });

    act(() => {
      result.current.next();
    });

    await waitFor(() => {
      expect(result.current.groupChannels).toHaveLength(0);
      expect(unFetchableQuery.next).not.toHaveBeenCalled();
    });
  });
});
