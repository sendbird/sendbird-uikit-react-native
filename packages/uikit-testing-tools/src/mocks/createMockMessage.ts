import { ChannelType } from '@sendbird/chat';
import { MessageType, SendingStatus } from '@sendbird/chat/message';
import type {
  SendbirdAdminMessage,
  SendbirdBaseMessage,
  SendbirdFileMessage,
  SendbirdMultipleFilesMessage,
  SendbirdSendableMessage,
  SendbirdUserMessage,
} from '@gathertown/uikit-utils';

import type { GetMockParams, GetMockProps } from '../types';
import { createTestContext } from '../utils/createTestContext';

type Params = GetMockParams<SendbirdFileMessage & SendbirdUserMessage & SendbirdAdminMessage>;
export const createMockMessage = (params: Params) => {
  return new MockMessage(params);
};

const tc = createTestContext();

class MockMessage implements GetMockProps<Params, SendbirdBaseMessage> {
  constructor(public params: Params) {
    tc.increaseIncrement();
    this.__updateIdsBySendingStatus(params);
    Object.assign(this, params);
  }

  __updateIdsBySendingStatus(params: Params) {
    if (!params.sendingStatus) return;

    const self = this.asSendableMessage();
    self.reqId = String(Date.now()) + tc.increment;

    const unsent = [SendingStatus.PENDING, SendingStatus.FAILED, SendingStatus.CANCELED].some(
      (it) => params.sendingStatus === it,
    );
    if (unsent) {
      self.messageId = 0;
    } else {
      self.messageId = tc.getRandom();
    }
  }

  channelType = ChannelType.BASE;
  channelUrl = 'channel_url_' + tc.getHash();
  createdAt = tc.date + tc.increment;
  updatedAt = 0;
  messageId = tc.getRandom();
  messageType = MessageType.BASE;
  parentMessageId = 0;
  parentMessage = null;
  silent = false;
  isOperatorMessage = false;
  data = '';
  customType = '';
  mentionType = null;
  mentionedUsers = null;
  mentionedUserIds = null;
  mentionedMessageTemplate = '';
  threadInfo = null;
  reactions = [];
  metaArrays = [];
  ogMetaData = null;
  appleCriticalAlertOptions = null;
  scheduledInfo = null;
  extendedMessage = {};

  isFileMessage(): this is SendbirdFileMessage {
    return this.messageType === MessageType.FILE && !Object.prototype.hasOwnProperty.call(this, 'fileInfoList');
  }

  isMultipleFilesMessage(): this is SendbirdMultipleFilesMessage {
    return this.messageType === MessageType.FILE && Object.prototype.hasOwnProperty.call(this, 'fileInfoList');
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
  asSendableMessage(): SendbirdSendableMessage {
    return this as unknown as SendbirdSendableMessage;
  }
  asBaseMessage(): SendbirdBaseMessage {
    return this as unknown as SendbirdBaseMessage;
  }
}
