import { act, renderHook, waitFor } from '@testing-library/react-native';

import { createMockSendbirdChat } from '@sendbird/uikit-testing-tools';

import { useOpenChannelListWithQuery } from '../../../channel/useOpenChannelList/useOpenChannelListWithQuery';

describe('useOpenChannelListWithQuery', () => {
  it('should initialize and return open channels', async () => {
    const sdk = createMockSendbirdChat({ testType: 'success', userId: 'test' });
    const { result } = renderHook(() => useOpenChannelListWithQuery(sdk, sdk.currentUser?.userId));

    expect(result.current.loading).toBe(true);
    expect(result.current.openChannels).toHaveLength(0);

    await waitFor(() => {
      expect(sdk.openChannel.createOpenChannelListQuery).toHaveBeenCalledTimes(1);
      expect(result.current.loading).toBe(false);
      expect(result.current.openChannels).not.toHaveLength(0);
    });
  });

  it('should refresh open channels', async () => {
    const sdk = createMockSendbirdChat({ testType: 'success', userId: 'test' });
    const { result } = renderHook(() => useOpenChannelListWithQuery(sdk, sdk.currentUser?.userId));

    await waitFor(() => {
      expect(sdk.openChannel.createOpenChannelListQuery).toHaveBeenCalledTimes(1);
      expect(result.current.refreshing).toBe(false);
    });

    act(() => {
      result.current.refresh();
    });
    expect(result.current.refreshing).toBe(true);

    await waitFor(() => {
      expect(sdk.openChannel.createOpenChannelListQuery).toHaveBeenCalledTimes(2);
      expect(result.current.refreshing).toBe(false);
    });
  });

  it('should fetch next open channels', async () => {
    const sdk = createMockSendbirdChat({ testType: 'success', userId: 'test' });
    const { result } = renderHook(() => useOpenChannelListWithQuery(sdk, sdk.currentUser?.userId));

    let limit = 0;

    await waitFor(() => {
      expect(result.current.openChannels).not.toHaveLength(0);
      limit = result.current.openChannels.length;
    });

    act(() => {
      result.current.next();
    });

    await waitFor(() => {
      expect(result.current.openChannels).toHaveLength(limit * 2);
    });
  });

  it('should use queryCreator when creating query', async () => {
    const sdk = createMockSendbirdChat({ testType: 'success', userId: 'test' });
    const queryParams = { limit: 5 };
    const options = { queryCreator: jest.fn(() => sdk.openChannel.createOpenChannelListQuery(queryParams)) };

    const { result } = renderHook(() => useOpenChannelListWithQuery(sdk, sdk.currentUser?.userId, options));

    await waitFor(() => {
      expect(options.queryCreator).toHaveBeenCalledTimes(1);
      expect(sdk.openChannel.createOpenChannelListQuery).toHaveBeenCalledWith(queryParams);
      expect(result.current.loading).toBe(false);
      expect(result.current.refreshing).toBe(false);
      expect(result.current.openChannels).toHaveLength(queryParams.limit);
    });
  });

  it('should handle error when query throws an error', async () => {
    const sdk = createMockSendbirdChat({ testType: 'failure', userId: 'test' });
    const error = new Error('Fetch failure');
    const options = {
      queryCreator: jest.fn(() => {
        const query = sdk.openChannel.createOpenChannelListQuery({ limit: 10 });
        query.next = jest.fn().mockRejectedValue(error);
        return query;
      }),
    };

    const { result } = renderHook(() => useOpenChannelListWithQuery(sdk, sdk.currentUser?.userId, options));
    expect(result.current.error).toEqual(null);

    await waitFor(() => {
      expect(options.queryCreator).toHaveBeenCalledTimes(1);
      expect(result.current.error).toEqual(error);
    });

    act(() => {
      result.current.refresh();
    });

    expect(result.current.error).toEqual(null);

    await waitFor(() => {
      expect(options.queryCreator).toHaveBeenCalledTimes(2);
      expect(result.current.error).toEqual(error);
    });
  });
});
