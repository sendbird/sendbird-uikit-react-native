// @ts-nocheck
import {
  MessageCollectionEventHandler,
  MessageCollectionInitHandler,
  MessageCollectionInitPolicy,
  MessageCollectionInitResultHandler,
  MessageCollectionParams,
  MessageFilter,
} from '@sendbird/chat/groupChannel';
import { BaseMessage, SendingStatus } from '@sendbird/chat/message';
import type {
  SendbirdBaseMessage,
  SendbirdGroupChannel,
  SendbirdMessageCollection,
  SendbirdSendableMessage,
} from '@sendbird/uikit-utils';

import type { GetMockParams, GetMockProps } from '../types';
import { createTestContext } from '../utils/createTestContext';
import { createMockMessage } from './createMockMessage';

type Params = GetMockParams<MessageCollectionParams & { groupChannel: SendbirdGroupChannel; dataLength: number }>;
export const createMockMessageCollection = (params: Params) => {
  return new MockMessageCollection(params);
};

const tc = createTestContext();

class MockMessageCollection implements GetMockProps<Params, Omit<SendbirdMessageCollection, 'viewTop' | 'viewBottom'>> {
  constructor(public params: Params) {
    Object.assign(this, params);

    this.__messages = Array(this.params.dataLength ?? (this.params.limit ?? 10) * 5)
      .fill(null)
      .map(() => createMockMessage({ sdk: this.params.sdk, sendingStatus: SendingStatus.SUCCEEDED }).asBaseMessage())
      .reverse();
  }
  __handlerId?: string;
  __messages: SendbirdBaseMessage[] = [];
  __cursor = 0;
  __fetchedMessage: SendbirdBaseMessage[] = [];
  __initialized = false;

  __apiInitHandler: MessageCollectionInitResultHandler = () => void 0;
  __cacheInitHandler: MessageCollectionInitResultHandler = () => void 0;

  setMessageCollectionHandler = jest.fn((handler: MessageCollectionEventHandler) => {
    if (this.params.sdk && this.channel) {
      this.__handlerId = String(tc.getRandom());
      this.params.sdk.__context.groupChannelMessageCollectionHandlers = {
        ...this.params.sdk.__context.groupChannelMessageCollectionHandlers,
        [this.channel.url]: {
          ...this.params.sdk.__context.groupChannelMessageCollectionHandlers[this.channel.url],
          [this.__handlerId]: handler,
        },
      };
    }
  });

  initialize = jest.fn((_policy: MessageCollectionInitPolicy) => {
    const initHandler: MessageCollectionInitHandler<BaseMessage> = {
      onCacheResult: jest.fn((handler: MessageCollectionInitResultHandler) => {
        this.__cacheInitHandler = handler;
        return initHandler;
      }),
      onApiResult: jest.fn((handler: MessageCollectionInitResultHandler) => {
        this.__apiInitHandler = handler;
        return initHandler;
      }),
    };

    setTimeout(() => {
      const start = this.__cursor;
      const end = start + (this.params.limit ?? 10);
      this.__fetchedMessage = [...this.__fetchedMessage, ...this.__messages.slice(start, end)];
      this.__cursor = end;
      this.__initialized = true;
      this.__cacheInitHandler(null as unknown as Error, this.__fetchedMessage);
    }, 0);

    setTimeout(() => {
      this.__apiInitHandler(null as unknown as Error, this.__fetchedMessage);
    }, 1);

    return initHandler;
  });
  dispose = jest.fn(() => {
    if (this.__handlerId && this.params.sdk && this.channel) {
      delete this.params.sdk.__context.groupChannelMessageCollectionHandlers[this.channel.url][this.__handlerId];
    }
  });

  removeFailedMessage = jest.fn();
  loadNext = jest.fn(async () => {
    return [];
  });

  loadPrevious = jest.fn(async () => {
    if (this.hasPrevious) {
      const start = this.__cursor;
      const end = start + (this.params.limit ?? 10);
      const messages = this.__messages.slice(start, end);
      this.__fetchedMessage = [...this.__fetchedMessage, ...messages];
      this.__cursor = end;

      return messages;
    } else {
      return [];
    }
  });

  filter = new MessageFilter();
  get channel(): SendbirdGroupChannel {
    return this.params.groupChannel as unknown as SendbirdGroupChannel;
  }

  get hasNext(): boolean {
    if (!this.__initialized) return false;
    return false;
  }

  get hasPrevious(): boolean {
    if (!this.__initialized) return false;
    return this.__fetchedMessage.length < this.__messages.length;
  }

  get failedMessages(): SendbirdSendableMessage[] {
    return [];
  }
  get pendingMessages(): SendbirdSendableMessage[] {
    return [];
  }

  get succeededMessages(): SendbirdBaseMessage[] {
    return this.__fetchedMessage;
  }

  asMessageCollection() {
    return this as unknown as SendbirdMessageCollection;
  }
}
