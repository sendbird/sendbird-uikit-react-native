import { render } from '@testing-library/react-native';
import React from 'react';

import type { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import type { SendbirdChatSDK } from '@sendbird/uikit-utils';

import { useChannelHandler } from '../handler/useChannelHandler';
import { createMockSendbird } from './__mocks__/createMockSendbirdSDK';

function Component({
  sdk,
  handlerId,
  handler,
}: {
  handlerId: string;
  sdk: SendbirdChatSDK;
  handler: Partial<GroupChannelHandler>;
}) {
  useChannelHandler(sdk, handlerId, handler, 'group');
  return null;
}
describe('useChannelHandler', () => {
  it('should add and remove the channel handler when mounted and unmounted', () => {
    const sdk = createMockSendbird();
    const handlerId = 'test-handler-id';
    const removeGroupChannelHandler = sdk.groupChannel.removeGroupChannelHandler;
    const addGroupChannelHandler = sdk.groupChannel.addGroupChannelHandler;

    const { unmount } = render(
      <Component handlerId={handlerId} sdk={sdk} handler={{ onMessageReceived: jest.fn() }} />,
    );
    expect(addGroupChannelHandler).toHaveBeenCalledWith(handlerId, expect.any(Object));

    unmount();
    expect(removeGroupChannelHandler).toHaveBeenCalledWith(handlerId);
  });

  it('should channel handler triggered when event received', () => {
    const sdk = createMockSendbird();
    const handler = { onMessageReceived: jest.fn() };

    render(<Component handlerId={'test-handler-id'} sdk={sdk} handler={handler} />);
    expect(handler.onMessageReceived).toHaveBeenCalledTimes(0);
    sdk.__emit('channel', 'group_onMessageReceived');
    expect(handler.onMessageReceived).toHaveBeenCalledTimes(1);
    sdk.__emit('channel', 'group_onMessageReceived');
    expect(handler.onMessageReceived).toHaveBeenCalledTimes(2);
    sdk.__emit('channel', 'group_onMessageUpdated');
    expect(handler.onMessageReceived).toHaveBeenCalledTimes(2);
  });
});
