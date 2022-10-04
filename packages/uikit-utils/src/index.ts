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

export * from './hooks';
export * from './ui-format/groupChannel';
export * from './ui-format/common';
export * from './sendbird/channel';
export * from './sendbird/message';
export * from './sendbird/attrs';

export const NOOP: () => void = () => void 0;
export const ASYNC_NOOP = async () => void 0;
export const PASS = <T>(val: T) => val;
export const toMegabyte = (byte: number) => byte / 1024 / 1024;

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
} from './types';
