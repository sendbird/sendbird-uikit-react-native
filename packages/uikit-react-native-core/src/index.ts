// export * from '@sendbird/uikit-chat-hooks';

/** Context **/
export { SendbirdChatContext, SendbirdChatProvider, useSendbirdChat } from './contexts/SendbirdChat';
export { PlatformServiceContext, PlatformServiceProvider, usePlatformService } from './contexts/PlatformService';
export { LocalizationContext, LocalizationProvider, useLocalization } from './contexts/Localization';

/** Components **/
export { default as ChatFlatList } from './components/ChatFlatList';
export { default as TypedPlaceholder } from './components/TypedPlaceholder';
export { default as ChannelCover } from './components/ChannelCover';
export { default as StatusComposition } from './components/StatusComposition';

/** Hooks **/
export { default as useConnection } from './hooks/useConnection';
export { default as usePushTokenRegistration } from './hooks/usePushTokenRegistration';

/** Localization **/
export { default as StringSetEn } from './localization/StringSet.en';
export { createBaseStringSet } from './localization/StringSet.type';
export type { StringSet, StringsLocale } from './localization/StringSet.type';

/** Platform API **/
export { default as createNativeFileService } from './platform/createFileService.native';
export { default as createNativeClipboardService } from './platform/createClipboardService.native';
export { default as createNativeNotificationService } from './platform/createNotificationService.native';
export { default as createExpoFileService } from './platform/createFileService.expo';
export { default as createExpoClipboardService } from './platform/createClipboardService.expo';
export { default as createExpoNotificationService } from './platform/createNotificationService.expo';
export type {
  FileServiceInterface,
  ClipboardServiceInterface,
  NotificationServiceInterface,
  FilePickerResponse,
  FileType,
} from './platform/types';

/** Domain **/
export * from './domain/groupChannel';
export type {
  GroupChannelProps,
  GroupChannelModule,
  GroupChannelFragment,
  GroupChannelContextsType,
} from './domain/groupChannel/types';

export * from './domain/groupChannelSettings';
export type {
  GroupChannelSettingsProps,
  GroupChannelSettingsModule,
  GroupChannelSettingsFragment,
  GroupChannelSettingsContextsType,
} from './domain/groupChannelSettings/types';

export * from './domain/groupChannelList';
export type {
  GroupChannelType,
  GroupChannelListProps,
  GroupChannelListModule,
  GroupChannelListFragment,
  GroupChannelListContextsType,
} from './domain/groupChannelList/types';

export * from './domain/userList';
export type { UserListProps, UserListModule, UserListContextsType } from './domain/userList/types';
export * from './domain/groupChannelUserList/types';
