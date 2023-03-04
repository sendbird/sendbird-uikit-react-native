import type { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import type { GroupChannelHandlerParams, OpenChannelHandlerParams } from '@sendbird/chat/lib/__definition';
import type { OpenChannelHandler } from '@sendbird/chat/openChannel';
import type { SendbirdChatSDK } from '@sendbird/uikit-utils';

const mockPromiseValue = {
  success: 'mockResolvedValue',
  failure: 'mockRejectedValue',
} as const;

interface MockSendbirdChatSDK extends SendbirdChatSDK {
  __emit(
    type: 'channel' | 'message',
    name: `group_${keyof GroupChannelHandlerParams}` | `open_${keyof OpenChannelHandlerParams}`,
  ): void;
  __context: {
    groupChannelHandlers: Record<string, GroupChannelHandler>;
    openChannelHandlers: Record<string, OpenChannelHandler>;
  };
}

export const createMockSendbird = (type: 'success' | 'failure' = 'success'): MockSendbirdChatSDK => {
  const pkey = mockPromiseValue[type];
  const __context: MockSendbirdChatSDK['__context'] = {
    groupChannelHandlers: {} as Record<string, GroupChannelHandler>,
    openChannelHandlers: {} as Record<string, OpenChannelHandler>,
  };

  return {
    groupChannel: {
      getChannel: jest.fn()[pkey]({}),
      addGroupChannelHandler: jest.fn(function (id: string, handler: GroupChannelHandler) {
        __context.groupChannelHandlers[id] = handler;
      }),
      removeGroupChannelHandler: jest.fn(function (id: string) {
        delete __context.groupChannelHandlers[id];
      }),
    },
    openChannel: {
      getChannel: jest.fn()[pkey]({}),
      addOpenChannelHandler: jest.fn(function (id: string, handler: OpenChannelHandler) {
        __context.openChannelHandlers[id] = handler;
      }),
      removeOpenChannelHandler: jest.fn(function (id: string) {
        delete __context.openChannelHandlers[id];
      }),
    },
    __context,
    __emit(...[name, type]: Parameters<MockSendbirdChatSDK['__emit']>) {
      switch (name) {
        case 'channel': {
          if (type.startsWith('open_')) {
            const eventName = type.replace('open_', '') as keyof OpenChannelHandlerParams;
            Object.values(__context.openChannelHandlers).forEach((handler) => {
              handler[eventName]?.({} as never, {} as never);
            });
          }
          if (type.startsWith('group_')) {
            const eventName = type.replace('group_', '') as keyof GroupChannelHandlerParams;
            Object.values(__context.groupChannelHandlers).forEach((handler) => {
              handler[eventName]?.({} as never, {} as never, {} as never);
            });
          }
          break;
        }
        case 'message': {
          break;
        }
      }
    },
  } as unknown as MockSendbirdChatSDK;
};
