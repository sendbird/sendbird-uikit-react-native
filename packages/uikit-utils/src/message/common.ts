import type { SendbirdMessage } from '../types';
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
  return (('reqId' in message && message.reqId) || message.messageId + '') + '/' + message.createdAt;
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
