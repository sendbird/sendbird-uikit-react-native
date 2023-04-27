export { Logger } from './shared/logger';
export { default as arrayToMap, arrayToMapWithGetter } from './shared/arrayToMap';
export * from './shared/regex';
export * from './shared/bufferedRequest';
export * from './shared/file';
export * from './shared';

export * from './hooks';
export * from './hooks/react-native';
export * from './ui-format/groupChannel';
export * from './ui-format/openChannel';
export * from './ui-format/common';
export * from './sendbird/channel';
export * from './sendbird/message';
export * from './sendbird/attrs';
export * from './sendbird/user';

export const NOOP: () => void = () => void 0;
export const ASYNC_NOOP = async () => void 0;
export const PASS = <T>(val: T) => val;
export const toMegabyte = (byte: number) => byte / 1024 / 1024;
export const isFunction = (param?: unknown): param is Function => typeof param === 'function';

export function ifThenOr<T>(cond: boolean, then: T): T | undefined;
export function ifThenOr<T, V>(cond: boolean, then: T, or: V): T | V;
export function ifThenOr(cond: boolean, then: unknown, or?: unknown) {
  if (cond) return then;
  return or;
}

export const SBErrorCode = {
  UNAUTHORIZED_REQUEST: 400108,
  RESOURCE_NOT_FOUND: 400201,
  BANNED_USER_SEND_MESSAGE_NOT_ALLOWED: 900100,
  CHANNEL_NOT_FOUND: 900500,
};
export const SBErrorMessage = {
  ACL:
    'Sendbird provides various access control options when using the Chat SDK.\n' +
    'By default, the Allow retrieving user list attribute is turned on to facilitate creating sample apps.\n' +
    'However, this may grant access to unwanted data or operations, leading to potential security concerns.\n' +
    'To manage your access control settings, you can turn on or off each setting on Sendbird Dashboard.',
};

export * from './types';
