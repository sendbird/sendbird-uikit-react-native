export { Logger } from './shared/logger';
export { default as arrayToMap, arrayToMapWithGetter } from './shared/arrayToMap';
export { createPubSub } from './shared/pubsub';
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
  replaceWithRegex,
  createMentionTemplateRegex,
} from './shared/regex';
export { BufferedRequest } from './shared/bufferedRequest';

export * from './shared';

export * from './hooks';
export * from './hooks/react-native';
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
    'Sendbird provides various access control options when using the Chat SDK.\n' +
    'By default, the Allow retrieving user list attribute is turned on to facilitate creating sample apps.\n' +
    'However, this may grant access to unwanted data or operations, leading to potential security concerns.\n' +
    'To manage your access control settings, you can turn on or off each setting on Sendbird Dashboard.',
};

export type {
  UserStruct,
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
  SendbirdReaction,
  SendbirdEmojiContainer,
  SendbirdEmoji,
  SendbirdEmojiCategory,
} from './types';
