import type { SendbirdMessage } from '../types';

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
