import { renderHook } from '@testing-library/react-native';

import { ConnectionHandler } from '@sendbird/chat';
import { createMockSendbirdChat } from '@sendbird/uikit-testing-tools';

import { useConnectionHandler } from '../../handler/useConnectionHandler';

describe('useConnectionHandler', () => {
  it('should call addConnectionHandler with the correct arguments', () => {
    const sdk = createMockSendbirdChat();
    const handlerId = 'test_handler_id';

    renderHook(() => useConnectionHandler(sdk, handlerId, {}));

    expect(sdk.addConnectionHandler).toHaveBeenCalledWith(handlerId, expect.any(ConnectionHandler));
  });

  it('should call removeConnectionHandler with the correct arguments', () => {
    const sdk = createMockSendbirdChat();
    const handlerId = 'test_handler_id';

    const { unmount } = renderHook(() => useConnectionHandler(sdk, handlerId, {}));

    unmount();

    expect(sdk.removeConnectionHandler).toHaveBeenCalledWith(handlerId);
  });

  it('should connection handler triggered when event received', () => {
    const sdk = createMockSendbirdChat();
    const handlerId = 'test_handler_id';
    const hookHandler = { onReconnectStarted: jest.fn() };

    renderHook(() => useConnectionHandler(sdk, handlerId, hookHandler));

    sdk.__emit('connection', 'onReconnectStarted');

    expect(hookHandler.onReconnectStarted).toHaveBeenCalled();
  });
});
