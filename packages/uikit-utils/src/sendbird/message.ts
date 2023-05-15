import { MessageSearchOrder } from '@sendbird/chat/message';

import { getFileExtension, getFileType } from '../shared/file';
import type {
  SendbirdBaseChannel,
  SendbirdBaseMessage,
  SendbirdDataPayload,
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdMessage,
  SendbirdReaction,
  SendbirdSendableMessage,
} from '../types';
import { getMessageTimeFormat } from '../ui-format/common';

export function isNewMessage(msg: SendbirdMessage, currentUserId?: string) {
  const myMessage = isMyMessage(msg, currentUserId);
  if (myMessage) return false;
  if (msg.isAdminMessage()) return false;
  return msg.updatedAt === 0;
}

export function isSendableMessage(msg?: SendbirdMessage | null): msg is SendbirdSendableMessage {
  return msg !== undefined && msg !== null && 'sendingStatus' in msg;
}

export function isMyMessage(msg?: SendbirdMessage | null, currentUserId = '##__USER_ID_IS_NOT_PROVIDED__##') {
  if (!isSendableMessage(msg)) return false;
  return (
    ('sender' in msg && msg.sender?.userId === currentUserId) ||
    msg.sendingStatus === 'pending' ||
    msg.sendingStatus === 'failed' ||
    msg.sendingStatus === 'canceled'
  );
}

export function messageKeyExtractor(message: SendbirdMessage): string {
  return getMessageUniqId(message);
}

// |-------------------|-------------------|-----------------|-------------------|
// |   sending status  |       reqId       |    messageId    |     createdAt     |
// |-------------------|-------------------|-----------------|-------------------|
// |     pending       |    timestamp(A)   |        0        |    timestamp(B)   |
// |     canceled      |    timestamp(A)   |        0        |         ?         |
// |     failed        |    timestamp(A)   |        0        |         ?         |
// |     succeeded     | timestamp(A) / '' |    id from DB   |    timestamp(C)   |
// |-------------------|-------------------|-----------------|-------------------|
export function messageComparator(a: SendbirdMessage, b: SendbirdMessage) {
  let aStatusOffset = 0;
  let bStatusOffset = 0;

  if (isSendableMessage(a) && a.sendingStatus !== 'succeeded') aStatusOffset = 999999;
  if (isSendableMessage(b) && b.sendingStatus !== 'succeeded') bStatusOffset = 999999;

  return b.createdAt + bStatusOffset - (a.createdAt + aStatusOffset);
}

export function hasSameSender(a?: SendbirdMessage, b?: SendbirdMessage) {
  if (!a || !b) return false;
  if ('sender' in a && 'sender' in b) return a.sender?.userId === b.sender?.userId;
  return false;
}

export function calcMessageGrouping(
  groupEnabled: boolean,
  curr: SendbirdMessage,
  prev?: SendbirdMessage,
  next?: SendbirdMessage,
) {
  const getPrev = () => {
    if (!groupEnabled) return false;
    if (!prev) return false;
    if (curr.isAdminMessage()) return false;
    if (!hasSameSender(curr, prev)) return false;
    if (getMessageTimeFormat(new Date(curr.createdAt)) !== getMessageTimeFormat(new Date(prev.createdAt))) return false;
    return true;
  };

  const getNext = () => {
    if (!groupEnabled) return false;
    if (!next) return false;
    if (curr.isAdminMessage()) return false;
    if (!hasSameSender(curr, next)) return false;
    if (getMessageTimeFormat(new Date(curr.createdAt)) !== getMessageTimeFormat(new Date(next.createdAt))) return false;
    return true;
  };

  return { groupWithPrev: getPrev(), groupWithNext: getNext() };
}

export function getMessageUniqId(msg: SendbirdBaseMessage) {
  if (msg.isUserMessage() || msg.isFileMessage()) {
    if (msg.sendingStatus === 'succeeded') return String(msg.messageId);
    return msg.reqId;
  }

  return String(msg.messageId);
}

export function getAvailableUriFromFileMessage(message: SendbirdFileMessage) {
  if (!message.url && message.messageParams.file && 'uri' in message.messageParams.file) {
    return message.messageParams.file.uri;
  }
  return message.url;
}

type RawSendbirdDataPayload = { sendbird: string | object };
export function isSendbirdNotification(dataPayload?: {
  [key: string]: string | object;
}): dataPayload is RawSendbirdDataPayload {
  if (!dataPayload) return false;
  return Boolean(dataPayload['sendbird']);
}

export function parseSendbirdNotification(dataPayload: RawSendbirdDataPayload): SendbirdDataPayload {
  return typeof dataPayload.sendbird === 'string' ? JSON.parse(dataPayload.sendbird) : dataPayload.sendbird;
}

export function shouldRenderReaction(channel: SendbirdBaseChannel, reactionEnabled: boolean) {
  if (channel.isOpenChannel()) {
    return false;
  }

  if (channel.isGroupChannel()) {
    if (channel.isBroadcast) return false;
    if (channel.isSuper) return false;
    if (channel.isEphemeral) return false;
  }

  return reactionEnabled;
}

export function getReactionCount(reaction: SendbirdReaction) {
  return reaction.userIds.length;
}

type MessageType =
  | 'user'
  | 'admin'
  | 'file'
  | 'unknown'
  | `user.${'opengraph'}`
  | `file.${'image' | 'video' | 'audio'}`;

export function getFileTypeFromMessage(message: SendbirdFileMessage) {
  return getFileType(message.type || getFileExtension(message.name));
}

export function getMessageType(message: SendbirdMessage): MessageType {
  if (message.isAdminMessage()) {
    return 'admin';
  }

  if (message.isUserMessage()) {
    if (message.ogMetaData) {
      return 'user.opengraph';
    }
    return 'user';
  }

  if (message.isFileMessage()) {
    const fileType = getFileTypeFromMessage(message);
    switch (fileType) {
      case 'image':
      case 'video': {
        return `file.${fileType}`;
      }
      case 'audio': {
        return `file.${fileType}`;
      }
      default: {
        return 'file';
      }
    }
  }

  return 'unknown';
}

export function getDefaultMessageSearchQueryParams(channel: SendbirdGroupChannel, keyword: string) {
  return {
    keyword,
    channelUrl: channel.url,
    messageTimestampFrom: Math.max(channel.joinedAt, channel.invitedAt),
    order: MessageSearchOrder.TIMESTAMP,
  };
}
