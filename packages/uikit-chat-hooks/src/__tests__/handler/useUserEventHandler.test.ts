import { renderHook } from '@testing-library/react-native';

import { UserEventHandler } from '@sendbird/chat';
import { createMockSendbirdChat } from '@sendbird/uikit-testing-tools';

import { useUserEventHandler } from '../../handler/useUserEventHandler';

describe('useUserEventHandler', () => {
  it('should call addUserEventHandler with the correct arguments', () => {
    const sdk = createMockSendbirdChat();
    const handlerId = 'test_handler_id';

    renderHook(() => useUserEventHandler(sdk, handlerId, {}));

    expect(sdk.addUserEventHandler).toHaveBeenCalledWith(handlerId, expect.any(UserEventHandler));
  });

  it('should call removeUserEventHandler with the correct arguments', () => {
    const sdk = createMockSendbirdChat();
    const handlerId = 'test_handler_id';

    const { unmount } = renderHook(() => useUserEventHandler(sdk, handlerId, {}));

    unmount();

    expect(sdk.removeUserEventHandler).toHaveBeenCalledWith(handlerId);
  });

  it('should connection handler triggered when event received', () => {
    const sdk = createMockSendbirdChat();
    const handlerId = 'test_handler_id';
    const hookHandler = { onTotalUnreadMessageCountUpdated: jest.fn() };
    const eventArgs = [123, {}];

    renderHook(() => useUserEventHandler(sdk, handlerId, hookHandler));

    sdk.__emit('userEvent', 'onTotalUnreadMessageCountUpdated', ...eventArgs);

    expect(hookHandler.onTotalUnreadMessageCountUpdated).toHaveBeenCalledWith(...eventArgs);
  });
});
