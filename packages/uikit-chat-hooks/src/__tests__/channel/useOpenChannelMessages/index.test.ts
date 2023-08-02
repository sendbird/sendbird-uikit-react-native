import { renderHook, waitFor } from '@testing-library/react-native';

import { createMockSendbirdChat } from '@sendbird/uikit-testing-tools';

import { useOpenChannelMessages } from '../../../channel/useOpenChannelMessages';
import { useOpenChannelMessagesWithQuery } from '../../../channel/useOpenChannelMessages/useOpenChannelMessagesWithQuery';

jest.mock('../../../channel/useOpenChannelMessages/useOpenChannelMessagesWithQuery', () => ({
  useOpenChannelMessagesWithQuery: jest.fn(),
}));

describe('useOpenChannelMessages', () => {
  const sdk = createMockSendbirdChat();

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should mock useOpenChannelMessagesWithQuery', () => {
    expect(jest.isMockFunction(useOpenChannelMessagesWithQuery)).toBe(true);
  });

  it('should call useOpenChannelMessagesWithQuery with the correct arguments', async () => {
    const channel = await sdk.openChannel.getChannel('channel-1');
    const options = { onChannelDeleted: jest.fn() };

    renderHook(() => useOpenChannelMessages(sdk, channel, sdk.currentUser?.userId, options));

    await waitFor(() => {
      expect(useOpenChannelMessagesWithQuery).toHaveBeenCalledWith(sdk, channel, sdk.currentUser?.userId, options);
    });
  });
});
