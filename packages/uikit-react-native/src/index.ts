import { Platform } from 'react-native';

import { Logger } from '@sendbird/uikit-utils';

import { PromisePolyfill } from './utils/promise';

/** Components **/
export { default as ChannelInput } from './components/ChannelInput';
export { default as ChannelMessageList } from './components/ChannelMessageList';
export { default as GroupChannelMessageRenderer } from './components/GroupChannelMessageRenderer';
export { default as OpenChannelMessageRenderer } from './components/OpenChannelMessageRenderer';
export { ReactionAddons } from './components/ReactionAddons';
export { ReactionBottomSheets } from './components/ReactionBottomSheets';
export { default as ChannelCover } from './components/ChannelCover';
export { default as ChatFlatList } from './components/ChatFlatList';
export { default as FileViewer } from './components/FileViewer';
export { default as MessageSearchResultItem } from './components/MessageSearchResultItem';
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
export { default as createMessageSearchFragment } from './fragments/createMessageSearchFragment';

/** Fragments - open channels **/
export { default as createOpenChannelFragment } from './fragments/createOpenChannelFragment';
export { default as createOpenChannelParticipantsFragment } from './fragments/createOpenChannelParticipantsFragment';
export { default as createOpenChannelSettingsFragment } from './fragments/createOpenChannelSettingsFragment';
export { default as createOpenChannelListFragment } from './fragments/createOpenChannelListFragment';
export { default as createOpenChannelCreateFragment } from './fragments/createOpenChannelCreateFragment';
export { default as createOpenChannelModerationFragment } from './fragments/createOpenChannelModerationFragment';
export { default as createOpenChannelBannedUsersFragment } from './fragments/createOpenChannelBannedUsersFragment';
export { default as createOpenChannelMutedParticipantsFragment } from './fragments/createOpenChannelMutedParticipantsFragment';
export { default as createOpenChannelOperatorsFragment } from './fragments/createOpenChannelOperatorsFragment';
export { default as createOpenChannelRegisterOperatorFragment } from './fragments/createOpenChannelRegisterOperatorFragment';

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
export { createBaseStringSet } from './localization/createBaseStringSet';
export { default as StringSetEn } from './localization/StringSet.en';
export * from './localization/StringSet.type';

/** Platform API **/
export { default as createNativeFileService } from './platform/createFileService.native';
export { default as createNativeClipboardService } from './platform/createClipboardService.native';
export { default as createNativeNotificationService } from './platform/createNotificationService.native';
export { default as createNativeMediaService } from './platform/createMediaService.native';
export { default as createNativePlayerService } from './platform/createPlayerService.native';
export { default as createNativeRecorderService } from './platform/createRecorderService.native';
export { default as createExpoFileService } from './platform/createFileService.expo';
export { default as createExpoClipboardService } from './platform/createClipboardService.expo';
export { default as createExpoNotificationService } from './platform/createNotificationService.expo';
export { default as createExpoMediaService } from './platform/createMediaService.expo';
export { default as createExpoPlayerService } from './platform/createPlayerService.expo';
export { default as createExpoRecorderService } from './platform/createRecorderService.expo';
export * from './platform/types';

/** Feature - shared **/
export * from './domain/userList';
export * from './domain/userList/types';

/** Feature - group channels **/
export * from './domain/groupChannel';
export * from './domain/groupChannel/types';

export * from './domain/groupChannelSettings';
export * from './domain/groupChannelSettings/types';

export * from './domain/groupChannelList';
export * from './domain/groupChannelList/types';

export * from './domain/groupChannelNotifications';
export * from './domain/groupChannelNotifications/types';

export * from './domain/groupChannelUserList/types';

export * from './domain/messageSearch/types';

/** Feature - open channels **/
export * from './domain/openChannel';
export * from './domain/openChannel/types';

export * from './domain/openChannelSettings';
export * from './domain/openChannelSettings/types';

export * from './domain/openChannelList';
export * from './domain/openChannelList/types';

export * from './domain/openChannelCreate';
export * from './domain/openChannelCreate/types';

export * from './domain/openChannelModeration';
export * from './domain/openChannelModeration/types';

export * from './domain/openChannelBannedUsers';
export * from './domain/openChannelBannedUsers/types';

export * from './domain/openChannelMutedParticipants';
export * from './domain/openChannelMutedParticipants/types';

export * from './domain/openChannelOperators';
export * from './domain/openChannelOperators/types';

export * from './domain/openChannelUserList/types';

/** UIKit **/
export { default as SendbirdUIKitContainer, SendbirdUIKit } from './containers/SendbirdUIKitContainer';
export type { SendbirdUIKitContainerProps } from './containers/SendbirdUIKitContainer';
export { default as SBUError } from './libs/SBUError';
export { default as SBUUtils } from './libs/SBUUtils';
export * from './types';

Logger.setLogLevel(__DEV__ ? 'warn' : 'none');
Logger.setTitle(`[UIKIT_${Platform.OS}]`);

// NOTE: In Hermes, not all implementations of Promise are included
PromisePolyfill.apply();
