import { renderHook, waitFor } from '@testing-library/react-native';

import { createMockSendbirdChat } from '@sendbird/uikit-testing-tools';

import { useGroupChannelList } from '../../../channel/useGroupChannelList';
import { useGroupChannelListWithCollection } from '../../../channel/useGroupChannelList/useGroupChannelListWithCollection';
import { useGroupChannelListWithQuery } from '../../../channel/useGroupChannelList/useGroupChannelListWithQuery';

jest.mock('../../../channel/useGroupChannelList/useGroupChannelListWithCollection', () => ({
  useGroupChannelListWithCollection: jest.fn(),
}));

jest.mock('../../../channel/useGroupChannelList/useGroupChannelListWithQuery', () => ({
  useGroupChannelListWithQuery: jest.fn(),
}));

describe('useGroupChannelList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should mock useGroupChannelListWithCollection', () => {
    expect(jest.isMockFunction(useGroupChannelListWithCollection)).toBe(true);
  });

  it('should mock useGroupChannelListWithQuery', () => {
    expect(jest.isMockFunction(useGroupChannelListWithQuery)).toBe(true);
  });

  it('should call useGroupChannelListWithCollection if the sdk.cacheEnabled is turned on', async () => {
    const sdk = createMockSendbirdChat({ localCacheEnabled: true });
    const options = { collectionCreator: jest.fn() };

    renderHook(() => useGroupChannelList(sdk, sdk.currentUser?.userId, options));

    await waitFor(() => {
      expect(useGroupChannelListWithCollection).toHaveBeenCalledTimes(1);
    });
  });

  it('should call useGroupChannelListWithCollection if the options.enableCollectionWithoutLocalCache is turned on', async () => {
    const sdk = createMockSendbirdChat({ localCacheEnabled: false });
    const options = { collectionCreator: jest.fn(), enableCollectionWithoutLocalCache: true };

    renderHook(() => useGroupChannelList(sdk, sdk.currentUser?.userId, options));

    await waitFor(() => {
      expect(useGroupChannelListWithCollection).toHaveBeenCalledTimes(1);
    });
  });

  it('should call useGroupChannelListWithCollection with the correct arguments', async () => {
    const sdk = createMockSendbirdChat({ localCacheEnabled: true });
    const options = { collectionCreator: jest.fn() };

    renderHook(() => useGroupChannelList(sdk, sdk.currentUser?.userId, options));

    await waitFor(() => {
      expect(useGroupChannelListWithCollection).toHaveBeenCalledTimes(1);
      expect(useGroupChannelListWithCollection).toHaveBeenCalledWith(sdk, sdk.currentUser?.userId, options);
    });
  });

  it('should call useGroupChannelListWithQuery with the correct arguments', async () => {
    const sdk = createMockSendbirdChat({ localCacheEnabled: false });
    const options = { queryCreator: jest.fn() };

    renderHook(() => useGroupChannelList(sdk, sdk.currentUser?.userId, options));

    await waitFor(() => {
      expect(useGroupChannelListWithQuery).toHaveBeenCalledTimes(1);
      expect(useGroupChannelListWithQuery).toHaveBeenCalledWith(sdk, sdk.currentUser?.userId, options);
    });
  });
});
