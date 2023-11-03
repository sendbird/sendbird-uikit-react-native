import type { Locale } from 'date-fns';

import type {
  SendbirdBaseMessage,
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdMember,
  SendbirdMessage,
  SendbirdOpenChannel,
  SendbirdParticipant,
  SendbirdUser,
  SendbirdUserMessage,
} from '@sendbird/uikit-utils';

/**
 * StringSet interface
 * Do not configure over 3 depths (for overrides easy)
 * */
export interface StringSet {
  OPEN_CHANNEL: {
    /** OpenChannel > Header */
    HEADER_TITLE: (channel: SendbirdOpenChannel) => string;
    HEADER_SUBTITLE: (channel: SendbirdOpenChannel) => string;

    /** OpenChannel > List */
    LIST_DATE_SEPARATOR: (date: Date, locale?: Locale) => string;

    /** OpenChannel > Message bubble */
    MESSAGE_BUBBLE_TIME: (message: SendbirdMessage, locale?: Locale) => string;
    MESSAGE_BUBBLE_FILE_TITLE: (message: SendbirdFileMessage) => string;
    MESSAGE_BUBBLE_EDITED_POSTFIX: string;
    MESSAGE_BUBBLE_UNKNOWN_TITLE: (message: SendbirdMessage) => string;
    MESSAGE_BUBBLE_UNKNOWN_DESC: (message: SendbirdMessage) => string;
  };
  OPEN_CHANNEL_PARTICIPANTS: {
    /** OpenChannelParticipants > Header */
    HEADER_TITLE: string;
  };
  OPEN_CHANNEL_SETTINGS: {
    /** OpenChannelSettings > Header */
    HEADER_TITLE: string;
    HEADER_RIGHT: string;

    /** OpenChannelSettings > Info */
    INFO_URL: string;

    /** OpenChannelSettings > Menu */
    MENU_MODERATION: string;
    MENU_PARTICIPANTS: string;
    MENU_DELETE_CHANNEL: string;

    /** OpenChannelSettings > Dialog */
    DIALOG_CHANNEL_DELETE_CONFIRM_TITLE: string;
    DIALOG_CHANNEL_DELETE_CONFIRM_OK: string;
    DIALOG_CHANNEL_DELETE_CONFIRM_CANCEL: string;
    DIALOG_CHANGE_NAME: string;
    DIALOG_CHANGE_IMAGE: string;
    DIALOG_CHANGE_NAME_PROMPT_TITLE: string;
    DIALOG_CHANGE_NAME_PROMPT_PLACEHOLDER: string;
    DIALOG_CHANGE_NAME_PROMPT_CANCEL: string;
    DIALOG_CHANGE_NAME_PROMPT_OK: string;
    DIALOG_CHANGE_IMAGE_MENU_TITLE: string;
    DIALOG_CHANGE_IMAGE_MENU_CAMERA: string;
    DIALOG_CHANGE_IMAGE_MENU_PHOTO_LIBRARY: string;
  };
  OPEN_CHANNEL_LIST: {
    /** OpenChannelList > Header */
    HEADER_TITLE: string;

    /** OpenChannelList > Channel preview */
    CHANNEL_PREVIEW_TITLE: (channel: SendbirdOpenChannel) => string;
  };
  OPEN_CHANNEL_CREATE: {
    /** OpenChannelCreate > Header */
    HEADER_TITLE: string;
    HEADER_RIGHT: string;

    /** OpenChannelCreate > ProfileInput */
    PLACEHOLDER: string;

    /** OpenChannelCreate > Dialog */
    DIALOG_IMAGE_MENU_REMOVE: string;
    DIALOG_IMAGE_MENU_CAMERA: string;
    DIALOG_IMAGE_MENU_PHOTO_LIBRARY: string;
  };
  OPEN_CHANNEL_MODERATION: {
    /** OpenChannelModeration > Header */
    HEADER_TITLE: string;

    /** OpenChannelModeration > Menu */
    MENU_OPERATORS: string;
    MENU_MUTED_PARTICIPANTS: string;
    MENU_BANNED_USERS: string;
  };
  OPEN_CHANNEL_BANNED_USERS: {
    /** OpenChannelBannedUsers > Header */
    HEADER_TITLE: string;
  };
  OPEN_CHANNEL_MUTED_PARTICIPANTS: {
    /** OpenChannelMutedMembers > Header */
    HEADER_TITLE: string;
  };
  OPEN_CHANNEL_OPERATORS: {
    /** OpenChannelOperators > Header */
    HEADER_TITLE: string;
  };
  OPEN_CHANNEL_REGISTER_OPERATOR: {
    /** OpenChannelRegisterOperator > Header */
    HEADER_TITLE: string;
    HEADER_RIGHT: (params: { selectedUsers: Array<SendbirdParticipant> }) => string;
  };
  GROUP_CHANNEL: {
    /** GroupChannel > Header */
    HEADER_TITLE: (currentUserId: string, channel: SendbirdGroupChannel) => string;

    /** GroupChannel > List */
    LIST_DATE_SEPARATOR: (date: Date, locale?: Locale) => string;
    LIST_BUTTON_NEW_MSG: (newMessages: SendbirdMessage[]) => string;

    /** GroupChannel > Message bubble */
    MESSAGE_BUBBLE_TIME: (message: SendbirdMessage, locale?: Locale) => string;
    MESSAGE_BUBBLE_FILE_TITLE: (message: SendbirdFileMessage) => string;
    MESSAGE_BUBBLE_EDITED_POSTFIX: string;
    MESSAGE_BUBBLE_UNKNOWN_TITLE: (message: SendbirdMessage) => string;
    MESSAGE_BUBBLE_UNKNOWN_DESC: (message: SendbirdMessage) => string;

    /** GroupChannel > Suggested mention list */
    MENTION_LIMITED: (mentionLimit: number) => string;
  };
  GROUP_CHANNEL_SETTINGS: {
    /** GroupChannelSettings > Header */
    HEADER_TITLE: string;
    HEADER_RIGHT: string;

    /** GroupChannelSettings > Menu */
    MENU_MODERATION: string;
    MENU_MEMBERS: string;
    MENU_SEARCH: string;
    MENU_LEAVE_CHANNEL: string;
    MENU_NOTIFICATION: string;
    MENU_NOTIFICATION_LABEL_ON: string;
    MENU_NOTIFICATION_LABEL_OFF: string;
    MENU_NOTIFICATION_LABEL_MENTION_ONLY: string;

    /** GroupChannelSettings > Dialog */
    DIALOG_CHANGE_NAME: string;
    DIALOG_CHANGE_IMAGE: string;
    DIALOG_CHANGE_NAME_PROMPT_TITLE: string;
    DIALOG_CHANGE_NAME_PROMPT_PLACEHOLDER: string;
    DIALOG_CHANGE_NAME_PROMPT_CANCEL: string;
    DIALOG_CHANGE_NAME_PROMPT_OK: string;
    DIALOG_CHANGE_IMAGE_MENU_TITLE: string;
    DIALOG_CHANGE_IMAGE_MENU_CAMERA: string;
    DIALOG_CHANGE_IMAGE_MENU_PHOTO_LIBRARY: string;
  };
  GROUP_CHANNEL_NOTIFICATIONS: {
    /** GroupChannelNotifications > Header */
    HEADER_TITLE: string;

    /** GroupChannelNotifications > Menu */
    MENU_NOTIFICATIONS: string;
    MENU_NOTIFICATIONS_DESC: string;
    MENU_NOTIFICATIONS_OPTION_ALL: string;
    MENU_NOTIFICATIONS_OPTION_MENTION_ONLY: string;
  };
  GROUP_CHANNEL_MODERATION: {
    /** GroupChannelModeration > Header */
    HEADER_TITLE: string;

    /** GroupChannelModeration > Menu */
    MENU_OPERATORS: string;
    MENU_MUTED_MEMBERS: string;
    MENU_BANNED_USERS: string;
    MENU_FREEZE_CHANNEL: string;
  };
  GROUP_CHANNEL_OPERATORS: {
    /** GroupChannelOperators > Header */
    HEADER_TITLE: string;
  };
  GROUP_CHANNEL_REGISTER_OPERATOR: {
    /** GroupChannelRegisterOperator > Header */
    HEADER_TITLE: string;
    HEADER_RIGHT: (params: { selectedUsers: Array<SendbirdMember> }) => string;
  };
  GROUP_CHANNEL_MUTED_MEMBERS: {
    /** GroupChannelMutedMembers > Header */
    HEADER_TITLE: string;
  };
  GROUP_CHANNEL_BANNED_USERS: {
    /** GroupChannelBannedUsers > Header */
    HEADER_TITLE: string;
  };
  GROUP_CHANNEL_LIST: {
    /** GroupChannelList > Header */
    HEADER_TITLE: string;

    /** GroupChannelList > Channel preview */
    CHANNEL_PREVIEW_TITLE: (currentUserId: string, channel: SendbirdGroupChannel) => string;
    CHANNEL_PREVIEW_TITLE_CAPTION: (channel: SendbirdGroupChannel, locale?: Locale) => string;
    CHANNEL_PREVIEW_BODY: (channel: SendbirdGroupChannel) => string;

    /** GroupChannelList > TypeSelector > Header */
    TYPE_SELECTOR_HEADER_TITLE: string;
    /** GroupChannelList > TypeSelector > Type string */
    TYPE_SELECTOR_GROUP: string;
    TYPE_SELECTOR_SUPER_GROUP: string;
    TYPE_SELECTOR_BROADCAST: string;

    /** GroupChannelList > Dialog > Channel */
    DIALOG_CHANNEL_TITLE: (currentUserId: string, channel: SendbirdGroupChannel) => string;
    DIALOG_CHANNEL_NOTIFICATION: (channel?: SendbirdGroupChannel) => string;
    DIALOG_CHANNEL_LEAVE: string;
  };
  GROUP_CHANNEL_MEMBERS: {
    /** GroupChannelMembers > Header */
    HEADER_TITLE: string;
  };
  GROUP_CHANNEL_INVITE: {
    /** GroupChannelInvite > Header */
    HEADER_TITLE: string;
    HEADER_RIGHT: <T>(params: { selectedUsers: Array<T> }) => string;
  };
  GROUP_CHANNEL_CREATE: {
    /** GroupChannelCreate > Header */
    HEADER_TITLE: string;
    HEADER_RIGHT: <T>(params: { selectedUsers: Array<T> }) => string;
  };
  MESSAGE_SEARCH: {
    /** MessageSearch > Header */
    HEADER_INPUT_PLACEHOLDER: string;
    HEADER_RIGHT: string;

    /** MessageSearch > Search result item */
    SEARCH_RESULT_ITEM_TITLE: (message: SendbirdBaseMessage) => string;
    SEARCH_RESULT_ITEM_TITLE_CAPTION: (message: SendbirdBaseMessage, locale?: Locale) => string;
    SEARCH_RESULT_ITEM_BODY: (message: SendbirdBaseMessage) => string;
  };
  // UI
  LABELS: {
    PERMISSION_APP_NAME: string;
    PERMISSION_CAMERA: string;
    PERMISSION_DEVICE_STORAGE: string;
    PERMISSION_MICROPHONE: string;

    USER_NO_NAME: string;
    CHANNEL_NO_MEMBERS: string;
    TYPING_INDICATOR_TYPINGS: (users: SendbirdUser[]) => string | undefined;
    REPLY_FROM_SENDER_TO_RECEIVER: (
      replyMessage: SendbirdUserMessage | SendbirdFileMessage,
      parentMessage: SendbirdUserMessage | SendbirdFileMessage,
      currentUserId?: string,
    ) => string;
    MESSAGE_UNAVAILABLE: string;

    USER_BAR_ME_POSTFIX: string;
    USER_BAR_OPERATOR: string;

    REGISTER_AS_OPERATOR: string;
    UNREGISTER_OPERATOR: string;
    MUTE: string;
    UNMUTE: string;
    BAN: string;
    UNBAN: string;

    /** ChannelMessageList **/
    CHANNEL_MESSAGE_LIST_FROZEN: string;

    /** ChannelInput **/
    CHANNEL_INPUT_PLACEHOLDER_ACTIVE: string;
    CHANNEL_INPUT_PLACEHOLDER_DISABLED: string;
    CHANNEL_INPUT_PLACEHOLDER_MUTED: string;
    CHANNEL_INPUT_PLACEHOLDER_REPLY: string;
    CHANNEL_INPUT_EDIT_OK: string;
    CHANNEL_INPUT_EDIT_CANCEL: string;
    /** ChannelInput > Attachments **/
    CHANNEL_INPUT_ATTACHMENT_CAMERA_PHOTO: string;
    CHANNEL_INPUT_ATTACHMENT_CAMERA_VIDEO: string;
    CHANNEL_INPUT_ATTACHMENT_PHOTO_LIBRARY: string;
    CHANNEL_INPUT_ATTACHMENT_FILES: string;
    CHANNEL_INPUT_REPLY_PREVIEW_TITLE: (user: SendbirdUser) => string;
    CHANNEL_INPUT_REPLY_PREVIEW_BODY: (message: SendbirdUserMessage | SendbirdFileMessage) => string;

    /** Channel > Message **/
    CHANNEL_MESSAGE_COPY: string;
    CHANNEL_MESSAGE_EDIT: string;
    CHANNEL_MESSAGE_SAVE: string;
    CHANNEL_MESSAGE_DELETE: string;
    CHANNEL_MESSAGE_REPLY: string;
    /** Channel > Message > Delete confirm **/
    CHANNEL_MESSAGE_DELETE_CONFIRM_TITLE: string;
    CHANNEL_MESSAGE_DELETE_CONFIRM_OK: string;
    CHANNEL_MESSAGE_DELETE_CONFIRM_CANCEL: string;
    /** Channel > Message > Failed **/
    CHANNEL_MESSAGE_FAILED_RETRY: string;
    CHANNEL_MESSAGE_FAILED_REMOVE: string;

    /** Voice message **/
    VOICE_MESSAGE: string;
    VOICE_MESSAGE_INPUT_CANCEL: string;
  };
  FILE_VIEWER: {
    TITLE: (message: SendbirdFileMessage) => string;
    SUBTITLE: (message: SendbirdFileMessage) => string;
  };
  PLACEHOLDER: {
    NO_BANNED_USERS: string;
    NO_USERS: string;
    NO_CHANNELS: string;
    NO_MESSAGES: string;
    NO_MUTED_MEMBERS: string;
    NO_MUTED_PARTICIPANTS: string;
    NO_RESULTS_FOUND: string;
    ERROR: {
      MESSAGE: string;
      RETRY_LABEL: string;
    };
  };
  DIALOG: {
    ALERT_DEFAULT_OK: string;

    ALERT_PERMISSIONS_TITLE: string;
    ALERT_PERMISSIONS_MESSAGE: (permission: string, appName: string) => string;
    ALERT_PERMISSIONS_OK: string;

    PROMPT_DEFAULT_OK: string;
    PROMPT_DEFAULT_CANCEL: string;
    PROMPT_DEFAULT_PLACEHOLDER: string;
  };
  TOAST: {
    COPY_OK: string;
    DOWNLOAD_START: string;
    DOWNLOAD_OK: string;
    DOWNLOAD_ERROR: string;
    OPEN_CAMERA_ERROR: string;
    OPEN_PHOTO_LIBRARY_ERROR: string;
    OPEN_FILES_ERROR: string;
    RESEND_MSG_ERROR: string;
    DELETE_MSG_ERROR: string;
    SEND_MSG_ERROR: string;
    USER_MUTED_ERROR: string;
    CHANNEL_FROZEN_ERROR: string;
    UPDATE_MSG_ERROR: string;
    TURN_ON_NOTIFICATIONS_ERROR: string;
    TURN_OFF_NOTIFICATIONS_ERROR: string;
    LEAVE_CHANNEL_ERROR: string;
    UNKNOWN_ERROR: string;
    GET_CHANNEL_ERROR: string;
    FIND_PARENT_MSG_ERROR: string;
  };
  PROFILE_CARD: {
    BUTTON_MESSAGE: string;
    BODY_LABEL: string;
    BODY: (user: SendbirdUser | SendbirdMember) => string;
  };
}
