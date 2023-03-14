import { renderHook } from '@testing-library/react-native';

import { useChannelHandler } from '../../handler/useChannelHandler';
import { createMockSendbird } from '../__mocks__/createMockSendbirdSDK';

describe('useChannelHandler', () => {
  it('should add and remove the group channel handler when mounted and unmounted', () => {
    const sdk = createMockSendbird();
    const handlerId = 'test-handler-id';
    const handler = { onMessageReceived: jest.fn() };

    const { unmount } = renderHook(() => useChannelHandler(sdk, handlerId, handler, 'group'));

    expect(sdk.groupChannel.addGroupChannelHandler).toHaveBeenCalledWith(handlerId, expect.any(Object));
    expect(sdk.openChannel.addOpenChannelHandler).not.toHaveBeenCalled();

    unmount();

    expect(sdk.groupChannel.removeGroupChannelHandler).toHaveBeenCalledWith(handlerId);
    expect(sdk.openChannel.removeOpenChannelHandler).not.toHaveBeenCalled();
  });

  it('should add and remove the open channel handler when mounted and unmounted', () => {
    const sdk = createMockSendbird();
    const handlerId = 'test-handler-id';
    const handler = { onMessageReceived: jest.fn() };

    const { unmount } = renderHook(() => useChannelHandler(sdk, handlerId, handler, 'open'));

    expect(sdk.openChannel.addOpenChannelHandler).toHaveBeenCalledWith(handlerId, expect.any(Object));
    expect(sdk.groupChannel.addGroupChannelHandler).not.toHaveBeenCalled();

    unmount();

    expect(sdk.openChannel.removeOpenChannelHandler).toHaveBeenCalledWith(handlerId);
    expect(sdk.groupChannel.removeGroupChannelHandler).not.toHaveBeenCalled();
  });

  it('should use group type as default when type is not provided to useChannelHandler', () => {
    const sdk = createMockSendbird();
    const handlerId = 'test-handler-id';
    const handler = { onMessageReceived: jest.fn() };

    renderHook(() => useChannelHandler(sdk, handlerId, handler));

    expect(sdk.groupChannel.addGroupChannelHandler).toHaveBeenCalledWith(handlerId, expect.any(Object));
  });

  it('should not handle handlers when an unknown type is provided to useChannelHandler', () => {
    const sdk = createMockSendbird();

    const { unmount } = renderHook(() => useChannelHandler(sdk, 'test-handler-id', {} as never, 'wrong' as never));

    expect(sdk.groupChannel.addGroupChannelHandler).not.toHaveBeenCalled();
    expect(sdk.openChannel.addOpenChannelHandler).not.toHaveBeenCalled();

    unmount();

    expect(sdk.groupChannel.removeGroupChannelHandler).not.toHaveBeenCalled();
    expect(sdk.openChannel.removeOpenChannelHandler).not.toHaveBeenCalled();
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
    sdk.__emit('channel', 'open_onMessageReceived');
    expect(handler.onMessageReceived).toHaveBeenCalledTimes(2);
  });
});
