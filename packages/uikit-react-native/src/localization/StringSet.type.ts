import type { Locale } from 'date-fns';

import type {
  PartialDeep,
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdMember,
  SendbirdMessage,
  SendbirdUser,
} from '@sendbird/uikit-utils';
import {
  getDateSeparatorFormat,
  getGroupChannelLastMessage,
  getGroupChannelPreviewTime,
  getGroupChannelTitle,
  getMessageTimeFormat,
} from '@sendbird/uikit-utils';

/**
 * StringSet interface
 * Do not configure over 3 depths (for overrides easy)
 * */
export interface StringSet {
  GROUP_CHANNEL: {
    /** GroupChannel > Header */
    HEADER_TITLE: (currentUserId: string, channel: SendbirdGroupChannel) => string;

    /** GroupChannel > List */
    LIST_BANNER_FROZEN: string;
    LIST_DATE_SEPARATOR: (date: Date, locale?: Locale) => string;
    LIST_BUTTON_NEW_MSG: (newMessages: SendbirdMessage[]) => string;

    /** GroupChannel > Message bubble */
    MESSAGE_BUBBLE_TIME: (message: SendbirdMessage, locale?: Locale) => string;
    MESSAGE_BUBBLE_FILE_TITLE: (message: SendbirdFileMessage) => string;
    MESSAGE_BUBBLE_EDITED_POSTFIX: string;
    MESSAGE_BUBBLE_UNKNOWN_TITLE: (message: SendbirdMessage) => string;
    MESSAGE_BUBBLE_UNKNOWN_DESC: (message: SendbirdMessage) => string;

    /** GroupChannel > Input */
    INPUT_PLACEHOLDER_ACTIVE: string;
    INPUT_PLACEHOLDER_DISABLED: string;
    INPUT_PLACEHOLDER_MUTED: string;
    INPUT_EDIT_OK: string;
    INPUT_EDIT_CANCEL: string;

    /** GroupChannel > Suggested mention list */
    MENTION_LIMITED: (mentionLimit: number) => string;

    /** GroupChannel > Dialog > Message */
    DIALOG_MESSAGE_COPY: string;
    DIALOG_MESSAGE_EDIT: string;
    DIALOG_MESSAGE_SAVE: string;
    DIALOG_MESSAGE_DELETE: string;
    /** GroupChannel > Dialog > Message > Delete confirm */
    DIALOG_MESSAGE_DELETE_CONFIRM_TITLE: string;
    DIALOG_MESSAGE_DELETE_CONFIRM_OK: string;
    DIALOG_MESSAGE_DELETE_CONFIRM_CANCEL: string;
    /** GroupChannel > Dialog > Message > Failed */
    DIALOG_MESSAGE_FAILED_RETRY: string;
    DIALOG_MESSAGE_FAILED_REMOVE: string;

    /** GroupChannel > Dialog > Attachments */
    DIALOG_ATTACHMENT_CAMERA: string;
    DIALOG_ATTACHMENT_PHOTO_LIBRARY: string;
    DIALOG_ATTACHMENT_FILES: string;
  };
  GROUP_CHANNEL_SETTINGS: {
    /** GroupChannelSettings > Header */
    HEADER_TITLE: string;
    HEADER_RIGHT: string;

    /** GroupChannelSettings > Menu */
    MENU_MODERATION: string;
    MENU_MEMBERS: string;
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

    /** @deprecated Please use in LABELS **/
    USER_BAR_ME_POSTFIX: string;
    /** @deprecated Please use in LABELS **/
    USER_BAR_OPERATOR: string;
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
  // UI
  LABELS: {
    PERMISSION_APP_NAME: string;
    PERMISSION_CAMERA: string;
    PERMISSION_DEVICE_STORAGE: string;

    USER_NO_NAME: string;
    CHANNEL_NO_MEMBERS: string;
    TYPING_INDICATOR_TYPINGS: (users: SendbirdUser[]) => string | undefined;

    USER_BAR_ME_POSTFIX: string;
    USER_BAR_OPERATOR: string;

    REGISTER_AS_OPERATOR: string;
    UNREGISTER_OPERATOR: string;
    MUTE: string;
    UNMUTE: string;
    BAN: string;
    UNBAN: string;
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
    UPDATE_MSG_ERROR: string;
    TURN_ON_NOTIFICATIONS_ERROR: string;
    TURN_OFF_NOTIFICATIONS_ERROR: string;
    LEAVE_CHANNEL_ERROR: string;
  };
  PROFILE_CARD: {
    BUTTON_MESSAGE: string;
    BODY_LABEL: string;
    BODY: (user: SendbirdUser | SendbirdMember) => string;
  };
}

type StringSetCreateOptions = {
  dateLocale: Locale;
  overrides?: PartialDeep<StringSet>;
};

/**
 * Create string set
 * You can create localized String set, you should provide locale for date and string as a parameters
 *
 * @param {StringSetCreateOptions.dateLocale} dateLocale Date locale (from date-fns)
 * @param {StringSetCreateOptions.overrides} [overrides] Localized strings
 * */
export const createBaseStringSet = ({ dateLocale, overrides }: StringSetCreateOptions): StringSet => {
  const USER_NO_NAME = overrides?.LABELS?.USER_NO_NAME ?? '(No name)';
  const CHANNEL_NO_MEMBERS = overrides?.LABELS?.CHANNEL_NO_MEMBERS ?? '(No members)';
  return {
    GROUP_CHANNEL: {
      HEADER_TITLE: (currentUserId, channel) =>
        getGroupChannelTitle(currentUserId, channel, USER_NO_NAME, CHANNEL_NO_MEMBERS),
      LIST_BANNER_FROZEN: 'Channel is frozen',
      LIST_DATE_SEPARATOR: (date, locale) => getDateSeparatorFormat(date, locale ?? dateLocale),
      LIST_BUTTON_NEW_MSG: (newMessages) => `${newMessages.length} new messages`,

      MESSAGE_BUBBLE_TIME: (message, locale) => getMessageTimeFormat(new Date(message.createdAt), locale ?? dateLocale),
      MESSAGE_BUBBLE_FILE_TITLE: (message) => message.name,
      MESSAGE_BUBBLE_EDITED_POSTFIX: ' (edited)',
      MESSAGE_BUBBLE_UNKNOWN_TITLE: () => '(Unknown message type)',
      MESSAGE_BUBBLE_UNKNOWN_DESC: () => 'Cannot read this message.',

      INPUT_PLACEHOLDER_ACTIVE: 'Enter message',
      INPUT_PLACEHOLDER_DISABLED: 'Chat not available in this channel.',
      INPUT_PLACEHOLDER_MUTED: "You're muted by the operator.",
      INPUT_EDIT_OK: 'Save',
      INPUT_EDIT_CANCEL: 'Cancel',

      MENTION_LIMITED: (mentionLimit) => `You can have up to ${mentionLimit} mentions per message.`,

      DIALOG_MESSAGE_COPY: 'Copy',
      DIALOG_MESSAGE_EDIT: 'Edit',
      DIALOG_MESSAGE_SAVE: 'Save',
      DIALOG_MESSAGE_DELETE: 'Delete',
      DIALOG_MESSAGE_DELETE_CONFIRM_TITLE: 'Delete message?',
      DIALOG_MESSAGE_DELETE_CONFIRM_OK: 'Delete',
      DIALOG_MESSAGE_DELETE_CONFIRM_CANCEL: 'Cancel',
      DIALOG_MESSAGE_FAILED_RETRY: 'Retry',
      DIALOG_MESSAGE_FAILED_REMOVE: 'Remove',

      DIALOG_ATTACHMENT_CAMERA: 'Camera',
      DIALOG_ATTACHMENT_PHOTO_LIBRARY: 'Photo library',
      DIALOG_ATTACHMENT_FILES: 'Files',
      ...overrides?.GROUP_CHANNEL,
    },
    GROUP_CHANNEL_SETTINGS: {
      HEADER_TITLE: 'Channel information',
      HEADER_RIGHT: 'Edit',
      MENU_MODERATION: 'Moderation',
      MENU_MEMBERS: 'Members',
      MENU_LEAVE_CHANNEL: 'Leave channel',
      MENU_NOTIFICATION: 'Notifications',
      MENU_NOTIFICATION_LABEL_ON: 'On',
      MENU_NOTIFICATION_LABEL_OFF: 'Off',
      MENU_NOTIFICATION_LABEL_MENTION_ONLY: 'Mentions only',
      DIALOG_CHANGE_NAME: 'Change channel name',
      DIALOG_CHANGE_NAME_PROMPT_TITLE: 'Change channel name',
      DIALOG_CHANGE_NAME_PROMPT_PLACEHOLDER: 'Enter name',
      DIALOG_CHANGE_NAME_PROMPT_OK: 'Save',
      DIALOG_CHANGE_NAME_PROMPT_CANCEL: 'Cancel',
      DIALOG_CHANGE_IMAGE: 'Change channel image',
      DIALOG_CHANGE_IMAGE_MENU_TITLE: 'Change channel image',
      DIALOG_CHANGE_IMAGE_MENU_CAMERA: 'Take photo',
      DIALOG_CHANGE_IMAGE_MENU_PHOTO_LIBRARY: 'Choose photo',
      ...overrides?.GROUP_CHANNEL_SETTINGS,
    },
    GROUP_CHANNEL_NOTIFICATIONS: {
      HEADER_TITLE: 'Notifications',
      MENU_NOTIFICATIONS: 'Notifications',
      MENU_NOTIFICATIONS_DESC:
        'Turn on push notifications if you wish to be notified when messages are delivered to this channel.',
      MENU_NOTIFICATIONS_OPTION_ALL: 'All new messages',
      MENU_NOTIFICATIONS_OPTION_MENTION_ONLY: 'Mentions only',
      ...overrides?.GROUP_CHANNEL_NOTIFICATIONS,
    },
    GROUP_CHANNEL_MODERATION: {
      HEADER_TITLE: 'Moderation',
      MENU_OPERATORS: 'Operators',
      MENU_MUTED_MEMBERS: 'Muted members',
      MENU_BANNED_USERS: 'Banned users',
      MENU_FREEZE_CHANNEL: 'Freeze channel',
      ...overrides?.GROUP_CHANNEL_MODERATION,
    },
    GROUP_CHANNEL_OPERATORS: {
      HEADER_TITLE: 'Operators',
      ...overrides?.GROUP_CHANNEL_OPERATORS,
    },
    GROUP_CHANNEL_REGISTER_OPERATOR: {
      HEADER_TITLE: 'Set as operators',
      HEADER_RIGHT: ({ selectedUsers }) => {
        const len = selectedUsers.length;
        if (len === 0) return 'Add';
        return `Add (${len})`;
      },
      ...overrides?.GROUP_CHANNEL_OPERATORS,
    },
    GROUP_CHANNEL_MUTED_MEMBERS: {
      HEADER_TITLE: 'Muted members',
      ...overrides?.GROUP_CHANNEL_MUTED_MEMBERS,
    },
    GROUP_CHANNEL_BANNED_USERS: {
      HEADER_TITLE: 'Banned users',
      ...overrides?.GROUP_CHANNEL_BANNED_USERS,
    },
    GROUP_CHANNEL_LIST: {
      HEADER_TITLE: 'Channels',
      CHANNEL_PREVIEW_TITLE: (currentUserId, channel) =>
        getGroupChannelTitle(currentUserId, channel, USER_NO_NAME, CHANNEL_NO_MEMBERS),
      CHANNEL_PREVIEW_TITLE_CAPTION: (channel, locale) => getGroupChannelPreviewTime(channel, locale ?? dateLocale),
      CHANNEL_PREVIEW_BODY: (channel) => getGroupChannelLastMessage(channel),
      TYPE_SELECTOR_HEADER_TITLE: 'Channel type',
      TYPE_SELECTOR_GROUP: 'Group',
      TYPE_SELECTOR_SUPER_GROUP: 'Super group',
      TYPE_SELECTOR_BROADCAST: 'Broadcast',
      DIALOG_CHANNEL_TITLE: (currentUserId, channel) =>
        getGroupChannelTitle(currentUserId, channel, USER_NO_NAME, CHANNEL_NO_MEMBERS),
      DIALOG_CHANNEL_NOTIFICATION: (channel) => {
        if (!channel) return '';
        if (channel.myPushTriggerOption === 'off') return 'Turn on notifications';
        return 'Turn off notifications';
      },
      DIALOG_CHANNEL_LEAVE: 'Leave channel',
      ...overrides?.GROUP_CHANNEL_LIST,
    },
    GROUP_CHANNEL_MEMBERS: {
      HEADER_TITLE: 'Members',
      /** @deprecated Please use in LABELS **/
      USER_BAR_ME_POSTFIX: ' (You)',
      /** @deprecated Please use in LABELS **/
      USER_BAR_OPERATOR: 'Operator',
      ...overrides?.GROUP_CHANNEL_MEMBERS,
    },
    GROUP_CHANNEL_CREATE: {
      HEADER_TITLE: 'New channel',
      HEADER_RIGHT: ({ selectedUsers }) => {
        const len = selectedUsers.length;
        if (len === 0) return 'Create';
        return `Create (${len})`;
      },
      ...overrides?.GROUP_CHANNEL_CREATE,
    },
    GROUP_CHANNEL_INVITE: {
      HEADER_TITLE: 'Invite users',
      HEADER_RIGHT: ({ selectedUsers }) => {
        const len = selectedUsers.length;
        if (len === 0) return 'Invite';
        return `Invite (${len})`;
      },
      ...overrides?.GROUP_CHANNEL_INVITE,
    },
    LABELS: {
      PERMISSION_APP_NAME: 'Application',
      PERMISSION_CAMERA: 'camera',
      PERMISSION_DEVICE_STORAGE: 'device storage',
      USER_NO_NAME,
      CHANNEL_NO_MEMBERS,
      TYPING_INDICATOR_TYPINGS: (users, NO_NAME = USER_NO_NAME) => {
        const userNames = users.map((u) => u.nickname || NO_NAME);
        if (userNames.length === 0) return;
        if (userNames.length === 1) return `${userNames[0]} is typing...`;
        if (users.length === 2) return `${userNames.join(' and ')} are typing...`;
        return 'Several people are typing...';
      },
      USER_BAR_ME_POSTFIX: ' (You)',
      USER_BAR_OPERATOR: 'Operator',
      REGISTER_AS_OPERATOR: 'Register as operator',
      UNREGISTER_OPERATOR: 'Unregister operator',
      MUTE: 'Mute',
      UNMUTE: 'Unmute',
      BAN: 'Ban',
      UNBAN: 'Unban',
      ...overrides?.LABELS,
    },
    FILE_VIEWER: {
      TITLE: (message) => message.sender?.nickname || USER_NO_NAME,
      SUBTITLE: (message) => getMessageTimeFormat(new Date(message.createdAt), dateLocale),
    },
    PLACEHOLDER: {
      NO_BANNED_USERS: 'No banned users',
      NO_USERS: 'No users',
      NO_CHANNELS: 'No channels',
      NO_MESSAGES: 'No messages',
      NO_MUTED_MEMBERS: 'No muted members',
      NO_RESULTS_FOUND: 'No results found',
      ...overrides?.PLACEHOLDER,
      ERROR: {
        MESSAGE: 'Something went wrong',
        RETRY_LABEL: 'Retry',
        ...overrides?.PLACEHOLDER?.ERROR,
      },
    },
    DIALOG: {
      ALERT_DEFAULT_OK: 'OK',
      ALERT_PERMISSIONS_TITLE: 'Allow access?',
      ALERT_PERMISSIONS_MESSAGE: (permission, appName = 'Application') => {
        return `${appName} need permission to access your ${permission}.`;
      },
      ALERT_PERMISSIONS_OK: 'Go to settings',
      PROMPT_DEFAULT_OK: 'Submit',
      PROMPT_DEFAULT_CANCEL: 'Cancel',
      PROMPT_DEFAULT_PLACEHOLDER: 'Enter',
      ...overrides?.DIALOG,
    },
    TOAST: {
      COPY_OK: 'Copied',
      DOWNLOAD_START: 'Downloading...',
      DOWNLOAD_OK: 'File saved',
      DOWNLOAD_ERROR: "Couldn't download file.",
      OPEN_CAMERA_ERROR: "Couldn't open camera.",
      OPEN_FILES_ERROR: "Couldn't open files.",
      OPEN_PHOTO_LIBRARY_ERROR: "Couldn't open photo library.",
      DELETE_MSG_ERROR: "Couldn't delete message.",
      RESEND_MSG_ERROR: "Couldn't send message.",
      SEND_MSG_ERROR: "Couldn't send message.",
      UPDATE_MSG_ERROR: "Couldn't edit message.",
      TURN_ON_NOTIFICATIONS_ERROR: "Couldn't turn on notifications.",
      TURN_OFF_NOTIFICATIONS_ERROR: "Couldn't turn off notifications.",
      LEAVE_CHANNEL_ERROR: "Couldn't leave channel.",
      ...overrides?.TOAST,
    },
    PROFILE_CARD: {
      BUTTON_MESSAGE: 'Message',
      BODY_LABEL: 'User ID',
      BODY: (user) => user.userId,
      ...overrides?.PROFILE_CARD,
    },
  };
};
