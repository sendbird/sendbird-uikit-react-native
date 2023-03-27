import { act, renderHook, waitFor } from '@testing-library/react-native';

import { ChannelType } from '@sendbird/chat';
import { SendingStatus } from '@sendbird/chat/message';
import { createMockChannel, createMockMessage, createMockSendbirdChat } from '@sendbird/uikit-testing-tools';
import { PremiumFeatures } from '@sendbird/uikit-utils';

import { useMessageOutgoingStatus } from '../../common/useMessageOutgoingStatus';

let forceUpdate: jest.Mock;
jest.mock('@sendbird/uikit-utils', () => {
  const originalModule = jest.requireActual('@sendbird/uikit-utils');

  return {
    ...originalModule,
    useForceUpdate: () => {
      const update = jest.fn();
      forceUpdate = update;
      return update;
    },
  };
});

describe('useMessageOutgoingStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    forceUpdate?.mockClear();
  });

  it('should return none status if message is not provided', async () => {
    const sdk = createMockSendbirdChat();
    const channel = await sdk.groupChannel.getChannel('channel-url');
    const { result } = renderHook(() => useMessageOutgoingStatus(sdk, channel));

    await waitFor(() => {
      expect(result.current).toBe('NONE');
    });
  });

  it('should return none status if channel is broadcast', async () => {
    const sdk = createMockSendbirdChat();
    const channel = createMockChannel({ sdk, channelType: ChannelType.GROUP, isBroadcast: true });
    const { result } = renderHook(() => useMessageOutgoingStatus(sdk, channel));

    await waitFor(() => {
      expect(result.current).toBe('NONE');
    });
  });

  it('should return none status if channel is super', async () => {
    const sdk = createMockSendbirdChat();
    const channel = createMockChannel({ sdk, channelType: ChannelType.GROUP, isSuper: true });
    const { result } = renderHook(() => useMessageOutgoingStatus(sdk, channel));

    await waitFor(() => {
      expect(result.current).toBe('NONE');
    });
  });

  it('should return pending status', async () => {
    const sdk = createMockSendbirdChat();
    const channel = await sdk.groupChannel.getChannel('channel-url');
    const message = createMockMessage({
      channelUrl: channel.url,
      channelType: channel.channelType,
      sendingStatus: SendingStatus.PENDING,
    });
    const { result } = renderHook(() => useMessageOutgoingStatus(sdk, channel, message));

    await waitFor(() => {
      expect(result.current).toBe('PENDING');
    });
  });

  it('should return failed status', async () => {
    const sdk = createMockSendbirdChat();
    const channel = await sdk.groupChannel.getChannel('channel-url');
    const message = createMockMessage({
      channelUrl: channel.url,
      channelType: channel.channelType,
      sendingStatus: SendingStatus.FAILED,
    });
    const { result } = renderHook(() => useMessageOutgoingStatus(sdk, channel, message));

    await waitFor(() => {
      expect(result.current).toBe('FAILED');
    });
  });

  it('should return read status', async () => {
    const sdk = createMockSendbirdChat();
    const channel = await sdk.groupChannel.getChannel('channel-url');
    channel.getUnreadMemberCount = jest.fn(() => 0);
    const message = createMockMessage({
      channelUrl: channel.url,
      channelType: channel.channelType,
      sendingStatus: SendingStatus.SUCCEEDED,
    });

    const { result } = renderHook(() => useMessageOutgoingStatus(sdk, channel, message));

    await waitFor(() => {
      expect(channel.getUnreadMemberCount).toHaveBeenCalledWith(message);
      expect(result.current).toBe('READ');
    });
  });

  it('should return delivered status', async () => {
    const sdk = createMockSendbirdChat({
      appInfo: { premiumFeatureList: [PremiumFeatures.delivery_receipt] },
    });
    const channel = await sdk.groupChannel.getChannel('channel-url');
    channel.getUnreadMemberCount = jest.fn(() => 10);
    channel.getUndeliveredMemberCount = jest.fn(() => 0);
    const message = createMockMessage({
      channelUrl: channel.url,
      channelType: channel.channelType,
      sendingStatus: SendingStatus.SUCCEEDED,
    });
    const { result } = renderHook(() => useMessageOutgoingStatus(sdk, channel, message));

    await waitFor(() => {
      expect(channel.getUndeliveredMemberCount).toHaveBeenCalledWith(message);
      expect(result.current).toBe('DELIVERED');
    });
  });

  it('should return undelivered status', async () => {
    const sdk = createMockSendbirdChat({
      appInfo: { premiumFeatureList: [PremiumFeatures.delivery_receipt] },
    });
    const channel = await sdk.groupChannel.getChannel('channel-url');
    channel.getUnreadMemberCount = jest.fn(() => 10);
    channel.getUndeliveredMemberCount = jest.fn(() => 10);
    const message = createMockMessage({
      channelUrl: channel.url,
      channelType: channel.channelType,
      sendingStatus: SendingStatus.SUCCEEDED,
    });
    const { result } = renderHook(() => useMessageOutgoingStatus(sdk, channel, message));

    await waitFor(() => {
      expect(channel.getUndeliveredMemberCount).toHaveBeenCalledWith(message);
      expect(result.current).toBe('UNDELIVERED');
    });
  });

  it('should return unread status', async () => {
    const sdk = createMockSendbirdChat({ appInfo: { premiumFeatureList: [] } });
    const channel = await sdk.groupChannel.getChannel('channel-url');
    channel.getUnreadMemberCount = jest.fn(() => 10);
    const message = createMockMessage({
      channelUrl: channel.url,
      channelType: channel.channelType,
      sendingStatus: SendingStatus.SUCCEEDED,
    });
    const { result } = renderHook(() => useMessageOutgoingStatus(sdk, channel, message));

    await waitFor(() => {
      expect(channel.getUnreadMemberCount).toHaveBeenCalledWith(message);
      expect(result.current).toBe('UNREAD');
    });
  });

  it('should trigger forceUpdate when message status updated', async () => {
    const sdk = createMockSendbirdChat();
    const channel = await sdk.groupChannel.getChannel('channel-url');
    const message = createMockMessage({
      channelUrl: channel.url,
      channelType: channel.channelType,
      sendingStatus: SendingStatus.SUCCEEDED,
      sender: sdk.currentUser as never,
    });

    renderHook(() => useMessageOutgoingStatus(sdk, channel, message));

    act(() => {
      sdk.__emit('channel', 'group_onUndeliveredMemberStatusUpdated', channel);
    });

    await waitFor(() => {
      expect(forceUpdate).toHaveBeenCalledTimes(1);
    });

    act(() => {
      sdk.__emit('channel', 'group_onUnreadMemberStatusUpdated', channel);
    });

    await waitFor(() => {
      expect(forceUpdate).toHaveBeenCalledTimes(2);
    });
  });

  it('should not trigger forceUpdate if event not emitted', async () => {
    const sdk = createMockSendbirdChat();
    const channel = await sdk.groupChannel.getChannel('channel-url');
    const message = createMockMessage({
      channelUrl: channel.url,
      channelType: channel.channelType,
      sendingStatus: SendingStatus.SUCCEEDED,
      sender: sdk.currentUser as never,
    });

    renderHook(() => useMessageOutgoingStatus(sdk, channel, message));
    expect(forceUpdate).not.toHaveBeenCalled();
  });

  it('should not trigger forceUpdate if component unmounts before event', async () => {
    const sdk = createMockSendbirdChat();
    const channel = await sdk.groupChannel.getChannel('channel-url');
    const message = createMockMessage({
      channelUrl: channel.url,
      channelType: channel.channelType,
      sendingStatus: SendingStatus.SUCCEEDED,
      sender: sdk.currentUser as never,
    });

    const { unmount } = renderHook(() => useMessageOutgoingStatus(sdk, channel, message));
    unmount();

    act(() => {
      sdk.__emit('channel', 'group_onUndeliveredMemberStatusUpdated', channel);
      sdk.__emit('channel', 'group_onUnreadMemberStatusUpdated', channel);
    });

    await waitFor(() => {
      expect(forceUpdate).not.toHaveBeenCalled();
    });
  });
});
