import { renderHook, waitFor } from '@testing-library/react-native';

import { createMockSendbirdChat } from '@sendbird/uikit-testing-tools';

import { useOpenChannelList } from '../../../channel/useOpenChannelList';
import { useOpenChannelListWithQuery } from '../../../channel/useOpenChannelList/useOpenChannelListWithQuery';

jest.mock('../../../channel/useOpenChannelList/useOpenChannelListWithQuery', () => ({
  useOpenChannelListWithQuery: jest.fn(),
}));

describe('useOpenChannelList', () => {
  const sdk = createMockSendbirdChat();

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should mock useOpenChannelListWithQuery', () => {
    expect(jest.isMockFunction(useOpenChannelListWithQuery)).toBe(true);
  });

  it('should call useOpenChannelListWithQuery with the correct arguments', async () => {
    const options = { queryCreator: jest.fn() };

    renderHook(() => useOpenChannelList(sdk, sdk.currentUser?.userId, options));

    await waitFor(() => {
      expect(useOpenChannelListWithQuery).toHaveBeenCalledWith(sdk, sdk.currentUser?.userId, options);
    });
  });
});
