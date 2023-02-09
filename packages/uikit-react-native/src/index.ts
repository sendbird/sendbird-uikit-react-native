/** Components **/
import { Platform } from 'react-native';

import { Logger } from '@sendbird/uikit-utils';

export { default as MessageRenderer } from './components/MessageRenderer';
export { ReactionAddons } from './components/ReactionAddons';
export { ReactionBottomSheets } from './components/ReactionBottomSheets';
export { default as ChannelCover } from './components/ChannelCover';
export { default as ChatFlatList } from './components/ChatFlatList';
export { default as FileViewer } from './components/FileViewer';
export { default as NewMessagesButton } from './components/NewMessagesButton';
export { default as ProviderLayout } from './components/ProviderLayout';
export { default as ScrollToBottomButton } from './components/ScrollToBottomButton';
export { default as StatusComposition } from './components/StatusComposition';
export { default as TypedPlaceholder } from './components/TypedPlaceholder';
export { default as UserActionBar } from './components/UserActionBar';
export { default as UserSelectableBar } from './components/UserSelectableBar';

/** Fragments - group channels **/
export { default as createGroupChannelCreateFragment } from './fragments/createGroupChannelCreateFragment';
export { default as createGroupChannelFragment } from './fragments/createGroupChannelFragment';
export { default as createGroupChannelSettingsFragment } from './fragments/createGroupChannelSettingsFragment';
export { default as createGroupChannelInviteFragment } from './fragments/createGroupChannelInviteFragment';
export { default as createGroupChannelListFragment } from './fragments/createGroupChannelListFragment';
export { default as createGroupChannelMembersFragment } from './fragments/createGroupChannelMembersFragment';
export { default as createGroupChannelModerationFragment } from './fragments/createGroupChannelModerationFragment';
export { default as createGroupChannelOperatorsFragment } from './fragments/createGroupChannelOperatorsFragment';
export { default as createGroupChannelRegisterOperatorFragment } from './fragments/createGroupChannelRegisterOperatorFragment';
export { default as createGroupChannelMutedMembersFragment } from './fragments/createGroupChannelMutedMembersFragment';
export { default as createGroupChannelBannedUsersFragment } from './fragments/createGroupChannelBannedUsersFragment';
export { default as createGroupChannelNotificationsFragment } from './fragments/createGroupChannelNotificationsFragment';

/** Fragments - open channels **/
export { default as createOpenChannelFragment } from './fragments/createOpenChannelFragment';
export { default as createOpenChannelParticipantsFragment } from './fragments/createOpenChannelParticipantsFragment';
export { default as createOpenChannelSettingsFragment } from './fragments/createOpenChannelSettingsFragment';
export { default as createOpenChannelListFragment } from './fragments/createOpenChannelListFragment';
export { default as createOpenChannelCreateFragment } from './fragments/createOpenChannelCreateFragment';

/** Context **/
export { SendbirdChatContext, SendbirdChatProvider } from './contexts/SendbirdChatCtx';
export { PlatformServiceContext, PlatformServiceProvider } from './contexts/PlatformServiceCtx';
export { UserProfileContext, UserProfileProvider } from './contexts/UserProfileCtx';
export { LocalizationContext, LocalizationProvider } from './contexts/LocalizationCtx';

/** Hooks **/
export { default as useConnection } from './hooks/useConnection';
export { default as usePushTokenRegistration } from './hooks/usePushTokenRegistration';
export * from './hooks/useContext';

/** Localization **/
export { default as StringSetEn } from './localization/StringSet.en';
export { createBaseStringSet } from './localization/StringSet.type';
export type { StringSet } from './localization/StringSet.type';

/** Platform API **/
export { default as createNativeFileService } from './platform/createFileService.native';
export { default as createNativeClipboardService } from './platform/createClipboardService.native';
export { default as createNativeNotificationService } from './platform/createNotificationService.native';
export { default as createNativeMediaService } from './platform/createMediaService.native';
export { default as createExpoFileService } from './platform/createFileService.expo';
export { default as createExpoClipboardService } from './platform/createClipboardService.expo';
export { default as createExpoNotificationService } from './platform/createNotificationService.expo';
export { default as createExpoMediaService } from './platform/createMediaService.expo';

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
  MediaServiceInterface,
} from './platform/types';

/** Feature - shared **/
export * from './domain/userList';
export type { UserListProps, UserListModule, UserListContextsType } from './domain/userList/types';

/** Feature - group channels **/
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

export * from './domain/groupChannelNotifications';
export type {
  GroupChannelNotificationsProps,
  GroupChannelNotificationsModule,
  GroupChannelNotificationsFragment,
  GroupChannelNotificationsContextsType,
} from './domain/groupChannelNotifications/types';

export * from './domain/groupChannelUserList/types';

/** Feature - open channels **/
export * from './domain/openChannel';
export type {
  OpenChannelProps,
  OpenChannelModule,
  OpenChannelFragment,
  OpenChannelContextsType,
} from './domain/openChannel/types';

export * from './domain/openChannelSettings';
export type {
  OpenChannelSettingsProps,
  OpenChannelSettingsModule,
  OpenChannelSettingsFragment,
  OpenChannelSettingsContextsType,
} from './domain/openChannelSettings/types';

export * from './domain/openChannelList';
export type {
  OpenChannelListProps,
  OpenChannelListModule,
  OpenChannelListFragment,
  OpenChannelListContextsType,
} from './domain/openChannelList/types';

export * from './domain/openChannelCreate';
export type {
  OpenChannelCreateProps,
  OpenChannelCreateModule,
  OpenChannelCreateFragment,
  OpenChannelCreateContextsType,
} from './domain/openChannelCreate/types';

export * from './domain/openChannelUserList/types';

/** UIKit **/
export { default as SendbirdUIKitContainer, SendbirdUIKit } from './containers/SendbirdUIKitContainer';
export type { SendbirdUIKitContainerProps } from './containers/SendbirdUIKitContainer';
export { default as SBUError } from './libs/SBUError';
export { default as SBUUtils } from './libs/SBUUtils';

export * from './types';

Logger.setLogLevel(__DEV__ ? 'warn' : 'none');
Logger.setTitle(`[UIKIT_${Platform.OS}]`);
