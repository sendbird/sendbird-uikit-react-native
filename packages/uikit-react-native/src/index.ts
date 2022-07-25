/** Components **/
import { Platform } from 'react-native';

import { Logger } from '@sendbird/uikit-utils';

export { default as MessageRenderer } from './components/MessageRenderer';
export { default as ChannelCover } from './components/ChannelCover';
export { default as ChatFlatList } from './components/ChatFlatList';
export { default as NewMessagesButton } from './components/NewMessagesButton';
export { default as ProviderLayout } from './components/ProviderLayout';
export { default as ScrollToBottomButton } from './components/ScrollToBottomButton';
export { default as StatusComposition } from './components/StatusComposition';
export { default as TypedPlaceholder } from './components/TypedPlaceholder';
export { default as UserActionBar } from './components/UserActionBar';
export { default as UserSelectableBar } from './components/UserSelectableBar';

/** Fragments **/
export { default as createGroupChannelCreateFragment } from './fragments/createGroupChannelCreateFragment';
export { default as createGroupChannelFragment } from './fragments/createGroupChannelFragment';
export { default as createGroupChannelSettingsFragment } from './fragments/createGroupChannelSettingsFragment';
export { default as createGroupChannelInviteFragment } from './fragments/createGroupChannelInviteFragment';
export { default as createGroupChannelListFragment } from './fragments/createGroupChannelListFragment';
export { default as createGroupChannelMembersFragment } from './fragments/createGroupChannelMembersFragment';

/** Context **/
export { SendbirdChatContext, SendbirdChatProvider } from './contexts/SendbirdChat';
export { PlatformServiceContext, PlatformServiceProvider } from './contexts/PlatformService';
export { LocalizationContext, LocalizationProvider } from './contexts/Localization';

/** Hooks **/
export { default as useConnection } from './hooks/useConnection';
export { default as usePushTokenRegistration } from './hooks/usePushTokenRegistration';
export { useLocalization, usePlatformService, useSendbirdChat } from './hooks/useContext';

/** Localization **/
export { default as StringSetEn } from './localization/StringSet.en';
export { createBaseStringSet } from './localization/StringSet.type';
export type { StringSet } from './localization/StringSet.type';

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
  FilePickerServiceInterface,
  FileSystemServiceInterface,
  SaveOptions,
  OpenDocumentOptions,
  OpenCameraOptions,
  OpenMediaLibraryOptions,
  OpenResultListener,
  DownloadedPath,
  Unsubscribe,
  FilePickerResponse,
  FileType,
  NotificationServiceInterface,
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

/** UIKit **/
export {
  default as SendbirdUIKitContainer,
  SendbirdUIKit,
  SendbirdUIKitContainerProps,
} from './SendbirdUIKitContainer';

export * from './types';

Logger.setTitle(`[UIKIT_${Platform.OS}]`);
__DEV__ && Logger.setLogLevel('none');
