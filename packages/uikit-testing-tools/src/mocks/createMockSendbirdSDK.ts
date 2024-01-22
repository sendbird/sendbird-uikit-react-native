// @ts-nocheck
import {
  ApplicationUserListQueryParams,
  ChannelType,
  ConnectionHandler,
  PushTriggerOption,
  UserEventHandler,
} from '@sendbird/chat';
import type {
  GroupChannelCollectionEventHandler,
  GroupChannelCollectionParams,
  GroupChannelHandler,
  GroupChannelListQueryParams,
  MessageCollectionEventHandler,
} from '@sendbird/chat/groupChannel';
import type {
  AppInfo,
  ConnectionHandlerParams,
  GroupChannelHandlerParams,
  OpenChannelHandlerParams,
  UserEventHandlerParams,
} from '@sendbird/chat/lib/__definition';
import type { OpenChannelHandler, OpenChannelListQueryParams } from '@sendbird/chat/openChannel';
import type {
  SendbirdChatSDK,
  SendbirdGroupChannel,
  SendbirdGroupChannelCollection,
  SendbirdOpenChannel,
} from '@sendbird/uikit-utils';
import { ApplicationAttributes, PremiumFeatures } from '@sendbird/uikit-utils';

import { createTestContext } from '../utils/createTestContext';
import { createMockChannel } from './createMockChannel';
import { createMockGroupChannelCollection } from './createMockGroupChannelCollection';
import { createMockQuery } from './createMockQuery';
import { createMockUser } from './createMockUser';

const tc = createTestContext();

export interface MockSendbirdChatSDK extends SendbirdChatSDK {
  __emit(
    type: 'channel' | 'connection' | 'userEvent',
    name:
      | `group_${keyof GroupChannelHandlerParams}`
      | `open_${keyof OpenChannelHandlerParams}`
      | keyof ConnectionHandlerParams
      | keyof UserEventHandlerParams,
    ...args: unknown[]
  ): void;
  __context: {
    openChannels: SendbirdOpenChannel[];
    groupChannels: SendbirdGroupChannel[];
    groupChannelCollections: SendbirdGroupChannelCollection[];
    groupChannelHandlers: Record<string, GroupChannelHandler>;
    openChannelHandlers: Record<string, OpenChannelHandler>;
    connectionHandlers: Record<string, ConnectionHandler>;
    userEventHandlers: Record<string, UserEventHandler>;
    groupChannelCollectionHandlers: Record<string, GroupChannelCollectionEventHandler>;
    groupChannelMessageCollectionHandlers: Record<string, Record<string, MessageCollectionEventHandler>>;
    appInfo: AppInfo;
    localCacheEnabled: boolean;
  };
  __params: InitParams;
  __throwIfFailureTest(): void;
}

type InitParams = {
  testType?: 'success' | 'failure';
  userId?: string;
  appInfo?: Partial<AppInfo>;
  localCacheEnabled?: boolean;
};

const defaultParams: Required<InitParams> = {
  testType: 'success',
  userId: 'user_id_' + tc.getHash(),
  appInfo: {
    emojiHash: 'hash',
    uploadSizeLimit: 999999,
    useReaction: true,
    applicationAttributes: Object.values(ApplicationAttributes),
    premiumFeatureList: Object.values(PremiumFeatures),
    enabledChannelMemberShipHistory: false,
  },
  localCacheEnabled: false,
};

export const createMockSendbirdChat = (params: InitParams = defaultParams): MockSendbirdChatSDK => {
  return new MockSDK(params).asMockSendbirdChatSDK();
};

// @ts-ignore

class MockSDK implements MockSendbirdChatSDK {
  __params = defaultParams;
  __context = {
    groupChannels: [] as SendbirdGroupChannel[],
    openChannels: [] as SendbirdOpenChannel[],
    groupChannelCollections: [] as SendbirdGroupChannelCollection[],
    groupChannelHandlers: {} as Record<string, GroupChannelHandler>,
    openChannelHandlers: {} as Record<string, OpenChannelHandler>,
    connectionHandlers: {} as Record<string, ConnectionHandler>,
    userEventHandlers: {} as Record<string, UserEventHandler>,
    groupChannelCollectionHandlers: {} as Record<string, GroupChannelCollectionEventHandler>,
    groupChannelMessageCollectionHandlers: {} as Record<string, Record<string, MessageCollectionEventHandler>>,
    pushTriggerOption: PushTriggerOption.DEFAULT,
    appInfo: this.__params.appInfo as AppInfo,
    localCacheEnabled: this.__params.localCacheEnabled,
  };

  __emit(...[name, type, ...args]: Parameters<MockSendbirdChatSDK['__emit']>) {
    switch (name) {
      case 'channel': {
        if (type.startsWith('open_')) {
          const eventName = type.replace('open_', '') as keyof OpenChannelHandlerParams;
          Object.values(this.__context.openChannelHandlers).forEach((handler) => {
            // @ts-ignore
            handler[eventName]?.(...args);
          });
        }
        if (type.startsWith('group_')) {
          const eventName = type.replace('group_', '') as keyof GroupChannelHandlerParams;
          Object.values(this.__context.groupChannelHandlers).forEach((handler) => {
            // @ts-ignore
            handler[eventName]?.(...args);
          });
        }
        break;
      }
      case 'connection': {
        const eventName = type as keyof ConnectionHandlerParams;
        Object.values(this.__context.connectionHandlers).forEach((handler) => {
          // @ts-ignore
          handler[eventName]?.(...args);
        });
        break;
      }
      case 'userEvent': {
        const eventName = type as keyof UserEventHandlerParams;
        Object.values(this.__context.userEventHandlers).forEach((handler) => {
          // @ts-ignore
          handler[eventName]?.(...args);
        });
        break;
      }
    }
  }
  __throwIfFailureTest() {
    if (this.__params.testType === 'failure') throw new Error('Failure test');
  }

  currentUser = createMockUser(this.__params);
  addConnectionHandler = jest.fn((id: string, handler: ConnectionHandler) => {
    this.__context.connectionHandlers[id] = handler;
  });
  removeConnectionHandler = jest.fn((id: string) => {
    delete this.__context.connectionHandlers[id];
  });
  addUserEventHandler = jest.fn((id: string, handler: UserEventHandler) => {
    this.__context.userEventHandlers[id] = handler;
  });
  removeUserEventHandler = jest.fn((id: string) => {
    delete this.__context.userEventHandlers[id];
  });
  setPushTriggerOption = jest.fn(async (option: PushTriggerOption) => {
    this.__throwIfFailureTest();
    this.__context.pushTriggerOption = option;
    return this.__context.pushTriggerOption;
  });
  getPushTriggerOption = jest.fn(async () => {
    this.__throwIfFailureTest();
    return this.__context.pushTriggerOption;
  });

  connect = jest.fn(async () => {
    this.__throwIfFailureTest();
    this.__emit('connection', 'onReconnectStarted');
    this.__emit('connection', 'onReconnectSucceeded');
    return this.currentUser;
  });
  createApplicationUserListQuery = jest.fn((params?: ApplicationUserListQueryParams) => {
    return createMockQuery({ type: 'user', limit: params?.limit, dataLength: 200, sdk: this.asMockSendbirdChatSDK() });
  }) as unknown as SendbirdChatSDK['createApplicationUserListQuery'];
  get appInfo() {
    return this.__context.appInfo;
  }
  get isCacheEnabled() {
    return this.__context.localCacheEnabled;
  }

  groupChannel = {
    createMyGroupChannelListQuery: jest.fn((params?: GroupChannelListQueryParams) => {
      return createMockQuery({
        type: 'groupChannel',
        limit: params?.limit,
        dataLength: 200,
        sdk: this.asMockSendbirdChatSDK(),
      });
    }),
    createGroupChannelCollection: jest.fn((params?: GroupChannelCollectionParams) => {
      this.__throwIfFailureTest();

      const gcc = createMockGroupChannelCollection({ ...params, sdk: this.asMockSendbirdChatSDK() });
      this.__context.groupChannelCollections.push(gcc);
      return gcc;
    }),
    getChannel: jest.fn(async (url: string) => {
      this.__throwIfFailureTest();

      const channelInContext = this.__context.groupChannels.find((it) => it.url === url);
      if (channelInContext) {
        return channelInContext;
      } else {
        const channel = createMockChannel({
          channelType: ChannelType.GROUP,
          url,
          sdk: this.asMockSendbirdChatSDK(),
        }).asGroupChannel();
        this.__context.groupChannels.push(channel);
        return channel;
      }
    }),
    addGroupChannelHandler: jest.fn((id: string, handler: GroupChannelHandler) => {
      this.__context.groupChannelHandlers[id] = handler;
    }),
    removeGroupChannelHandler: jest.fn((id: string) => {
      delete this.__context.groupChannelHandlers[id];
    }),
    getTotalUnreadMessageCount: jest.fn(() => {
      return 10;
    }),
    getTotalUnreadChannelCount: jest.fn(() => {
      return 10;
    }),
  } as unknown as SendbirdChatSDK['groupChannel'];

  openChannel = {
    getChannel: jest.fn(async (url: string) => {
      this.__throwIfFailureTest();

      const channelInContext = this.__context.openChannels.find((it) => it.url === url);
      if (channelInContext) {
        return channelInContext;
      } else {
        const channel = createMockChannel({
          channelType: ChannelType.OPEN,
          url,
          sdk: this.asMockSendbirdChatSDK(),
        }).asOpenChannel();
        this.__context.openChannels.push(channel);
        return channel;
      }
    }),
    addOpenChannelHandler: jest.fn((id: string, handler: OpenChannelHandler) => {
      this.__context.openChannelHandlers[id] = handler;
    }),
    removeOpenChannelHandler: jest.fn((id: string) => {
      delete this.__context.openChannelHandlers[id];
    }),
    createOpenChannelListQuery: jest.fn((params?: OpenChannelListQueryParams) => {
      return createMockQuery({
        type: 'openChannel',
        limit: params?.limit,
        dataLength: 200,
        sdk: this.asMockSendbirdChatSDK(),
      });
    }),
  } as unknown as SendbirdChatSDK['openChannel'];
  constructor(params: InitParams = defaultParams) {
    this.__params = { ...defaultParams, ...params };
    this.__context.appInfo = {
      ...this.__context.appInfo,
      ...this.__params.appInfo,
    };
    this.__context.localCacheEnabled = this.__params.localCacheEnabled;
  }
  asMockSendbirdChatSDK() {
    return this as unknown as MockSendbirdChatSDK;
  }
}
