import { ChannelType } from '@sendbird/chat';
import { MessageType } from '@sendbird/chat/message';
import type {
  SendbirdAdminMessage,
  SendbirdBaseMessage,
  SendbirdFileMessage,
  SendbirdUserMessage,
} from '@sendbird/uikit-utils';

import { createFixtureContext } from '../__fixtures__/createFixtureContext';
import type { MockSendbirdChatSDK } from './createMockSendbirdSDK';

type MessageParams = { sdk?: MockSendbirdChatSDK } & Partial<SendbirdFileMessage> &
  Partial<SendbirdUserMessage> &
  Partial<SendbirdAdminMessage>;
export const createMockMessage = (params: MessageParams) => {
  return new MockMessage(params);
};

const fixture = createFixtureContext();

class MockMessage implements SendbirdBaseMessage {
  sdk?: MockSendbirdChatSDK;
  channelType: ChannelType = ChannelType.BASE;
  channelUrl: string = 'channel_url_' + fixture.getHash();
  createdAt: number = fixture.date + fixture.increment;
  messageId: number = fixture.getRandom();
  messageType = MessageType.BASE;
  constructor(params: MessageParams) {
    fixture.increaseIncrement();
    Object.entries(params).forEach(([key, value]) => {
      // @ts-ignore
      this[key] = value;
    });
    this.sdk = params.sdk;
  }

  isFileMessage(): this is SendbirdFileMessage {
    return this.messageType === MessageType.FILE;
  }
  isUserMessage(): this is SendbirdUserMessage {
    return this.messageType === MessageType.USER;
  }
  isAdminMessage(): this is SendbirdAdminMessage {
    return this.messageType === MessageType.ADMIN;
  }
  applyParentMessage(): boolean {
    return false;
  }

  applyReactionEvent(): void {
    return;
  }

  applyThreadInfoUpdateEvent(): boolean {
    return false;
  }

  getMetaArraysByKeys() {
    return [];
  }

  isEqual(): boolean {
    return false;
  }

  isIdentical(): boolean {
    return false;
  }

  serialize(): object {
    return Object.assign({}, this);
  }

  asFileMessage(): SendbirdFileMessage {
    return this as unknown as SendbirdFileMessage;
  }
  asUserMessage(): SendbirdUserMessage {
    return this as unknown as SendbirdUserMessage;
  }
  asAdminMessage(): SendbirdAdminMessage {
    return this as unknown as SendbirdAdminMessage;
  }
}
