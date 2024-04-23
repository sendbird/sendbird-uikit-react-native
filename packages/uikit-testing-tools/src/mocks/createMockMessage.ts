// @ts-nocheck
import { ChannelType } from '@sendbird/chat';
import { NotificationData } from '@sendbird/chat/feedChannel';
import { Form } from '@sendbird/chat/lib/__definition';
import { AdminMessage, Feedback, FeedbackStatus, MessageType, SendingStatus } from '@sendbird/chat/message';
import type {
  SendbirdAdminMessage,
  SendbirdBaseMessage,
  SendbirdFileMessage,
  SendbirdMultipleFilesMessage,
  SendbirdSendableMessage,
  SendbirdUserMessage,
} from '@sendbird/uikit-utils';

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
  notificationData: NotificationData | null = null;
  forms: Form[] | null = null;
  myFeedback: Feedback | null = null;
  myFeedbackStatus: FeedbackStatus = 'NO_FEEDBACK';
  suggestedReplies: string[] | null = null;

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

  deleteFeedback(_: number): Promise<void> {
    return Promise.resolve(undefined);
  }

  hasForm(): this is AdminMessage {
    return this.forms !== null;
  }

  submitFeedback(_: Pick<Feedback, 'rating' | 'comment'>): Promise<void> {
    return Promise.resolve(undefined);
  }

  submitForm(_: { formId?: string; answers?: Record<string, string> }): Promise<void> {
    return Promise.resolve(undefined);
  }

  updateFeedback(_: Feedback): Promise<void> {
    return Promise.resolve(undefined);
  }
  markThreadAsRead(): Promise<void> {
    return Promise.resolve();
  }
  setPushNotificationEnabled(_: boolean): Promise<void> {
    return Promise.resolve();
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
