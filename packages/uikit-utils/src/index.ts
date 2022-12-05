export { Logger } from './shared/logger';
export { default as arrayToMap, arrayToMapWithGetter } from './shared/arrayToMap';
export { createPubSub } from './shared/pubsub';
export { default as conditionChaining } from './shared/conditionChaining';
export {
  urlRegexStrict,
  urlRegexRough,
  newLineRegex,
  audioExtRegex,
  videoExtRegex,
  imageExtRegex,
  getFileType,
  getFileExtension,
  replaceUrlAsComponents,
  normalizeFileName,
  emailRegex,
  phoneRegex,
} from './shared/regex';
export { BufferedRequest } from './shared/bufferedRequest';

export * from './hooks';
export * from './ui-format/groupChannel';
export * from './ui-format/common';
export * from './sendbird/channel';
export * from './sendbird/message';
export * from './sendbird/attrs';
export * from './sendbird/user';

export const NOOP: () => void = () => void 0;
export const ASYNC_NOOP = async () => void 0;
export const PASS = <T>(val: T) => val;
export const toMegabyte = (byte: number) => byte / 1024 / 1024;
export const isFunction = <T>(param?: T): param is NonNullable<T> => typeof param === 'function';
export const SBErrorCode = {
  NON_AUTHORIZED: 400108,
};
export const SBErrorMessage = {
  ACL:
    "An error occurred because you don't have access to the user list in your application.\n" +
    'In order to gain access, you can turn on this attribute in the Access Control List settings on Sendbird Dashboard.',
};

export type {
  FilterByValueType,
  UnionToIntersection,
  OmittedValues,
  PartialDeep,
  Optional,
  ContextValue,
  SendbirdMessage,
  SendbirdChatSDK,
  SendbirdChannel,
  SendbirdBaseChannel,
  SendbirdGroupChannel,
  SendbirdOpenChannel,
  SendbirdUser,
  SendbirdMember,
  SendbirdBaseMessage,
  SendbirdUserMessage,
  SendbirdFileMessage,
  SendbirdAdminMessage,
  SendbirdGroupChannelCreateParams,
  SendbirdFileMessageCreateParams,
  SendbirdUserMessageCreateParams,
  SendbirdError,
  SendbirdMessageCollection,
  SendbirdGroupChannelCollection,
  NotificationFiles,
  NotificationMentionedUsers,
  NotificationTranslations,
  PartialNullable,
  SendbirdDataPayload,
  SendbirdPreviousMessageListQuery,
  SendbirdSendableMessage,
  SendbirdGroupChannelListQuery,
  SendbirdGroupChannelUpdateParams,
  SendbirdUserMessageUpdateParams,
  SendbirdFileMessageUpdateParams,
  SendbirdUserUpdateParams,
  SendbirdRestrictedUser,
} from './types';
