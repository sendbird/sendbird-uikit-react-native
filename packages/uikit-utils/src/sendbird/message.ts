import type Sendbird from 'sendbird';

import type { SendbirdDataPayload, SendbirdMessage } from '../types';
import { messageTime } from '../ui-format/common';

export function isNewMessage(msg: SendbirdMessage, currentUserId?: string) {
  const myMessage = isMyMessage(msg, currentUserId);
  if (myMessage) return false;
  if (msg.isAdminMessage()) return false;
  return msg.updatedAt === 0;
}

export function isMyMessage(msg: SendbirdMessage, currentUserId = '##__USER_ID_IS_NOT_PROVIDED__##') {
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
export function messageComparator<T extends SendbirdMessage>(a: T, b: T) {
  return b.createdAt - a.createdAt;
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
    if (messageTime(new Date(curr.createdAt)) !== messageTime(new Date(prev.createdAt))) return false;
    return true;
  };

  const getNext = () => {
    if (!groupEnabled) return false;
    if (!next) return false;
    if (curr.isAdminMessage()) return false;
    if (!hasSameSender(curr, next)) return false;
    if (messageTime(new Date(curr.createdAt)) !== messageTime(new Date(next.createdAt))) return false;
    return true;
  };

  return { groupWithPrev: getPrev(), groupWithNext: getNext() };
}

export function getMessageUniqId(msg: SendbirdMessage) {
  if (msg.isUserMessage() || msg.isFileMessage()) {
    if (msg.sendingStatus === 'succeeded') return msg.messageId + '';
    return msg.reqId;
  }

  return msg.messageId + '';
}

export function getAvailableUriFromFileMessage(message: Sendbird.FileMessage) {
  if (!message.url && message.messageParams && 'uri' in message.messageParams.file) {
    return message.messageParams.file.uri;
  }
  return message.url;
}

type RawSendbirdDataPayload = { message: string; sendbird: string };
export function isSendbirdNotification(dataPayload?: { [key: string]: string }): dataPayload is RawSendbirdDataPayload {
  if (!dataPayload) return false;
  return Boolean(dataPayload['sendbird']);
}

export function parseSendbirdNotification(dataPayload: RawSendbirdDataPayload): SendbirdDataPayload {
  return JSON.parse(dataPayload.sendbird);
}
