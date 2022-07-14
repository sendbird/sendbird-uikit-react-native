import type { Locale } from 'date-fns';

import type {
  PartialDeep,
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdMessage,
  SendbirdUser,
} from '@sendbird/uikit-utils';
import {
  dateSeparator,
  getGroupChannelLastMessage,
  getGroupChannelPreviewTime,
  getGroupChannelTitle,
  messageTime,
} from '@sendbird/uikit-utils';

export interface StringsLocale {
  locale: 'en';
}

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
    LIST_TOOLTIP_NEW_MSG: (newMessages: SendbirdMessage[]) => string;

    /** GroupChannel > Message bubble */
    MESSAGE_BUBBLE_TIME: (message: SendbirdMessage, locale?: Locale) => string;
    MESSAGE_BUBBLE_FILE_TITLE: (message: SendbirdFileMessage) => string;
    MESSAGE_BUBBLE_EDITED_POSTFIX: string;
    MESSAGE_BUBBLE_UNKNOWN_TITLE: (message: SendbirdMessage) => string;
    MESSAGE_BUBBLE_UNKNOWN_DESC: (message: SendbirdMessage) => string;

    /** GroupChannel > Input */
    INPUT_PLACEHOLDER_ACTIVE: string;
    INPUT_PLACEHOLDER_DISABLED: string;
    INPUT_EDIT_OK: string;
    INPUT_EDIT_CANCEL: string;

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
    MENU_NOTIFICATION: string;
    MENU_MEMBERS: string;
    MENU_LEAVE_CHANNEL: string;

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

    /** GroupChannelMembers > UserBar */
    USER_BAR_ME_POSTFIX: string;
    USER_BAR_OPERATOR: string;

    /** GroupChannelMembers > Dialog */
    DIALOG_USER_DISMISS_OPERATOR: string;
    DIALOG_USER_MUTE: string;
    DIALOG_USER_BAN: string;
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
    USER_NO_NAME: string;
    CHANNEL_NO_MEMBERS: string;
    TYPING_INDICATOR_TYPINGS: (users: SendbirdUser[]) => string | undefined;
  };
  PLACEHOLDER: {
    NO_BANNED_MEMBERS: string;
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
      LIST_DATE_SEPARATOR: (date, locale) => dateSeparator(date, locale ?? dateLocale),
      LIST_TOOLTIP_NEW_MSG: (newMessages) => `${newMessages.length} new messages`,

      MESSAGE_BUBBLE_TIME: (message, locale) => messageTime(new Date(message.createdAt), locale ?? dateLocale),
      MESSAGE_BUBBLE_FILE_TITLE: (message) => message.name,
      MESSAGE_BUBBLE_EDITED_POSTFIX: ' (edited)',
      MESSAGE_BUBBLE_UNKNOWN_TITLE: () => '(Unknown message type)',
      MESSAGE_BUBBLE_UNKNOWN_DESC: () => 'Cannot read this message.',

      INPUT_PLACEHOLDER_ACTIVE: 'Enter message',
      INPUT_PLACEHOLDER_DISABLED: 'Chat is unavailable in this channel',
      INPUT_EDIT_OK: 'Save',
      INPUT_EDIT_CANCEL: 'Cancel',

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
      MENU_NOTIFICATION: 'Notifications',
      MENU_MEMBERS: 'Members',
      MENU_LEAVE_CHANNEL: 'Leave channel',
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
      USER_BAR_ME_POSTFIX: ' (You)',
      USER_BAR_OPERATOR: 'Operator',
      DIALOG_USER_DISMISS_OPERATOR: 'Dismiss operator',
      DIALOG_USER_MUTE: 'Mute',
      DIALOG_USER_BAN: 'Ban',
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
      USER_NO_NAME,
      CHANNEL_NO_MEMBERS,
      TYPING_INDICATOR_TYPINGS: (users, NO_NAME = USER_NO_NAME) => {
        const userNames = users.map((u) => u.nickname || NO_NAME);
        if (userNames.length === 0) return;
        if (userNames.length === 1) return `${userNames[0]} is typing...`;
        if (users.length === 2) return `${userNames.join(' and ')} are typing...`;
        return 'Several people are typing...';
      },
      ...overrides?.LABELS,
    },
    PLACEHOLDER: {
      NO_BANNED_MEMBERS: 'No banned members',
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
  };
};
