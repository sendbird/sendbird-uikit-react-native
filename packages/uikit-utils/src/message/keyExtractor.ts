import type { SendbirdMessage } from '../types';

export function messageKeyExtractor(message: SendbirdMessage): string {
  return (('reqId' in message && message.reqId) || message.messageId + '') + '/' + message.createdAt;
}
