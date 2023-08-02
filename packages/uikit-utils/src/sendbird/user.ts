import type { Role } from '@sendbird/chat';

import type { UserStruct } from '../types';

export function ifOperator<T>(role: Role | null, then: T): T | undefined;
export function ifOperator<T, V>(role: Role | null, then: T, or: V): T | V;
export function ifOperator(role: Role | null, then: unknown, or?: unknown) {
  if (role === 'operator') return then;
  return or;
}

export function getUserUniqId<T extends UserStruct>(user: T) {
  return user.userId;
}
