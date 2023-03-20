import { ChannelType } from '@sendbird/chat';
import type { SendableMessage } from '@sendbird/chat/lib/__definition';
import { MessageType, SendingStatus } from '@sendbird/chat/message';
import type {
  SendbirdAdminMessage,
  SendbirdBaseMessage,
  SendbirdFileMessage,
  SendbirdUserMessage,
} from '@sendbird/uikit-utils';

import { createFixtureContext } from '../fixtures/createFixtureContext';
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
    this.__updateIdsBySendingStatus(params.sendingStatus);

    Object.entries(params).forEach(([key, value]) => {
      // @ts-ignore
      this[key] = value;
    });
    this.sdk = params.sdk;
  }

  __updateIdsBySendingStatus(sendingStatus: MessageParams['sendingStatus']) {
    if (!sendingStatus) return;

    const self = this.asSendableMessage();
    const notSent = [SendingStatus.PENDING, SendingStatus.FAILED, SendingStatus.CANCELED].some(
      (it) => sendingStatus === it,
    );
    if (notSent) {
      self.messageId = 0;
      self.reqId = String(Date.now()) + fixture.increment;
    } else {
      self.messageId = fixture.getRandom();
      self.reqId = '';
    }
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
  asSendableMessage(): SendableMessage {
    return this as unknown as SendableMessage;
  }
}
