// export * from '@sendbird/uikit-chat-hooks';

/** Context **/
export { SendbirdChatContext, SendbirdChatProvider, useSendbirdChat } from './contexts/SendbirdChat';
export { PlatformServiceContext, PlatformServiceProvider, usePlatformService } from './contexts/PlatformService';
export { LocalizationContext, LocalizationProvider, useLocalization } from './contexts/Localization';

/** Components **/
export { default as ChatFlatList } from './components/ChatFlatList';

/** Hooks **/
export { default as useConnection } from './hooks/useConnection';
export { default as usePushTokenRegistration } from './hooks/usePushTokenRegistration';

/** Localization **/
export { default as StringSetEn } from './localization/StringSet.en';
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
export * from './domain/groupChannelSettings';
export * from './domain/groupChannelList';
export * from './domain/userList';
export type {
  GroupChannelProps,
  GroupChannelModule,
  GroupChannelFragment,
  GroupChannelContextType,
} from './domain/groupChannel/types';
export type {
  GroupChannelSettingsProps,
  GroupChannelSettingsModule,
  GroupChannelSettingsFragment,
  GroupChannelSettingsContextType,
} from './domain/groupChannelSettings/types';
export type {
  GroupChannelType,
  GroupChannelListProps,
  GroupChannelListModule,
  GroupChannelListFragment,
  GroupChannelListContextType,
} from './domain/groupChannelList/types';

export type {
  GroupChannelCreateFragment,
  GroupChannelInviteFragment,
  GroupChannelMembersFragment,
} from './domain/groupChannelUserList/types';
export type { UserListProps, UserListModule, UserListFragment, UserListContextType } from './domain/userList/types';
