import { renderHook } from '@testing-library/react-native';

import { useChannelHandler } from '../../handler/useChannelHandler';
import { createMockSendbird } from '../__mocks__/createMockSendbirdSDK';

describe('useChannelHandler', () => {
  it('should add and remove the channel handler when mounted and unmounted', () => {
    const sdk = createMockSendbird();
    const handlerId = 'test-handler-id';
    const handler = { onMessageReceived: jest.fn() };

    const removeGroupChannelHandler = sdk.groupChannel.removeGroupChannelHandler;
    const addGroupChannelHandler = sdk.groupChannel.addGroupChannelHandler;

    const { unmount } = renderHook(() => useChannelHandler(sdk, handlerId, handler, 'group'));
    expect(addGroupChannelHandler).toHaveBeenCalledWith(handlerId, expect.any(Object));

    unmount();
    expect(removeGroupChannelHandler).toHaveBeenCalledWith(handlerId);
  });

  it('should channel handler triggered when event received', () => {
    const sdk = createMockSendbird();
    const handlerId = 'test-handler-id';
    const handler = { onMessageReceived: jest.fn() };

    renderHook(() => useChannelHandler(sdk, handlerId, handler, 'group'));
    expect(handler.onMessageReceived).toHaveBeenCalledTimes(0);
    sdk.__emit('channel', 'group_onMessageReceived');
    expect(handler.onMessageReceived).toHaveBeenCalledTimes(1);
    sdk.__emit('channel', 'group_onMessageReceived');
    expect(handler.onMessageReceived).toHaveBeenCalledTimes(2);
    sdk.__emit('channel', 'group_onMessageUpdated');
    expect(handler.onMessageReceived).toHaveBeenCalledTimes(2);
  });
});
