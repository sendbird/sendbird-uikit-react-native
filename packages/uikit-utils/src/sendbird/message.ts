import type {
  SendbirdBaseChannel,
  SendbirdBaseMessage,
  SendbirdDataPayload,
  SendbirdFileMessage,
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
  return channel.isGroupChannel() && !channel.isBroadcast && !channel.isSuper && reactionEnabled;
}

export function getReactionCount(reaction: SendbirdReaction) {
  return reaction.userIds.length;
}
