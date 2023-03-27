import { renderHook, waitFor } from '@testing-library/react-native';

import { createMockSendbirdChat } from '@sendbird/uikit-testing-tools';

import { useOpenChannel } from '../../channel/useOpenChannel';

describe('useOpenChannel', () => {
  it('should fetch open channel and return it', async () => {
    const channelUrl = 'test_channel_url';
    const sdk = createMockSendbirdChat();
    const { result } = renderHook(() => useOpenChannel(sdk, channelUrl));

    expect(result.current.loading).toBe(true);
    expect(result.current.channel).toBeUndefined();
    expect(result.current.error).toBeUndefined();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.channel).toBeDefined();
      expect(result.current.error).toBeUndefined();
      expect(sdk.openChannel.getChannel).toHaveBeenCalledWith(channelUrl);
    });
  });

  it('should set error state if fetching open channel fails', async () => {
    const channelUrl = 'test_channel_url';
    const sdk = createMockSendbirdChat({ testType: 'failure' });
    const { result } = renderHook(() => useOpenChannel(sdk, channelUrl));

    expect(result.current.loading).toBe(true);
    expect(result.current.channel).toBeUndefined();
    expect(result.current.error).toBeUndefined();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.channel).toBeUndefined();
      expect(result.current.error).toBeDefined();
      expect(sdk.openChannel.getChannel).toHaveBeenCalledWith(channelUrl);
    });
  });
});
