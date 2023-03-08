import { renderHook, waitFor } from '@testing-library/react-native';

import { useGroupChannel } from '../../channel/useGroupChannel';
import { createMockSendbird } from '../__mocks__/createMockSendbirdSDK';

describe('useGroupChannel', () => {
  it('should fetch group channel and return it', async () => {
    const channelUrl = 'test_channel_url';
    const sdk = createMockSendbird('success');
    const { result } = renderHook(() => useGroupChannel(sdk, channelUrl));

    expect(result.current.loading).toBe(true);
    expect(result.current.channel).toBeUndefined();
    expect(result.current.error).toBeUndefined();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.channel).toBeDefined();
      expect(result.current.error).toBeUndefined();
      expect(sdk.groupChannel.getChannel).toHaveBeenCalledWith(channelUrl);
    });
  });

  it('should set error state if fetching group channel fails', async () => {
    const channelUrl = 'test_channel_url';
    const sdk = createMockSendbird('failure');
    const { result } = renderHook(() => useGroupChannel(sdk, channelUrl));

    expect(result.current.loading).toBe(true);
    expect(result.current.channel).toBeUndefined();
    expect(result.current.error).toBeUndefined();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.channel).toBeUndefined();
      expect(result.current.error).toBeDefined();
      expect(sdk.groupChannel.getChannel).toHaveBeenCalledWith(channelUrl);
    });
  });
});
