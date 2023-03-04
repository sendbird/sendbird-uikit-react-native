import { renderHook, waitFor } from '@testing-library/react-native';

import { useOpenChannel } from '../channel/useOpenChannel';
import { createMockSendbird } from './__mocks__/createMockSendbirdSDK';

describe('useGroupChannel', () => {
  it('should fetch group channel and return it', async () => {
    const channelUrl = 'test_channel_url';
    const sdk = createMockSendbird('success');
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

  it('should set error state if fetching group channel fails', async () => {
    const channelUrl = 'test_channel_url';
    const sdk = createMockSendbird('failure');
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
