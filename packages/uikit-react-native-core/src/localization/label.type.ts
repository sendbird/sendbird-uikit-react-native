import type { Locale } from 'date-fns';
import type Sendbird from 'sendbird';

import type { PartialDeep, SendbirdMessage } from '@sendbird/uikit-utils';
import {
  dateSeparator,
  getGroupChannelLastMessage,
  getGroupChannelPreviewTime,
  getGroupChannelTitle,
  messageTime,
  truncate,
} from '@sendbird/uikit-utils';

export interface LabelLocale {
  locale: 'en';
}

/**
 * LabelSet interface
 * Do not configure over 3 depths (for overrides easy)
 * */
export interface LabelSet {
  GROUP_CHANNEL: {
    /** GroupChannel > Header */
    HEADER_TITLE: (currentUserId: string, channel: Sendbird.GroupChannel) => string;

    /** GroupChannel > List */
    LIST_BANNER_FROZEN: string;
    LIST_DATE_SEPARATOR: (date: Date, locale?: Locale) => string;
    LIST_TOOLTIP_NEW_MSG: (newMessages: SendbirdMessage[]) => string;

    /** GroupChannel > List > Message */
    LIST_MESSAGE_TIME: (message: SendbirdMessage, locale?: Locale) => string;
    LIST_MESSAGE_FILE_TITLE: (message: Sendbird.FileMessage) => string;
    LIST_MESSAGE_EDITED_POSTFIX: string;
    LIST_MESSAGE_UNKNOWN_TITLE: (message: SendbirdMessage) => string;
    LIST_MESSAGE_UNKNOWN_DESC: (message: SendbirdMessage) => string;

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
  GROUP_CHANNEL_INFO: {
    /** GroupChannelInfo > Header */
    HEADER_TITLE: string;
    HEADER_RIGHT: string;

    /** GroupChannelInfo > Menu */
    MENU_NOTIFICATION: string;
    MENU_MEMBERS: string;
    MENU_LEAVE_CHANNEL: string;

    /** GroupChannelInfo > Dialog */
    DIALOG_CHANGE_NAME: string;
    DIALOG_CHANGE_IMAGE: string;
    DIALOG_CHANGE_NAME_TITLE: string;
    DIALOG_CHANGE_NAME_PLACEHOLDER: string;
    DIALOG_CHANGE_NAME_CANCEL: string;
    DIALOG_CHANGE_NAME_OK: string;
    DIALOG_CHANGE_IMAGE_TITLE: string;
    DIALOG_CHANGE_IMAGE_CAMERA: string;
    DIALOG_CHANGE_IMAGE_PHOTO_LIBRARY: string;
  };
  GROUP_CHANNEL_LIST: {
    /** GroupChannelList > Header */
    HEADER_TITLE: string;

    /** GroupChannelList > Preview */
    PREVIEW_TITLE: (currentUserId: string, channel: Sendbird.GroupChannel) => string;
    PREVIEW_TITLE_CAPTION: (channel: Sendbird.GroupChannel) => string;
    PREVIEW_BODY: (channel: Sendbird.GroupChannel) => string;

    /** GroupChannelList > TypeSelector > Header */
    TYPE_SELECTOR_HEADER_TITLE: string;
    /** GroupChannelList > TypeSelector > Type string */
    TYPE_SELECTOR_GROUP: string;
    TYPE_SELECTOR_SUPER_GROUP: string;
    TYPE_SELECTOR_BROADCAST: string;

    /** GroupChannelList > Dialog > Channel */
    DIALOG_CHANNEL_TITLE: (currentUserId: string, channel: Sendbird.GroupChannel) => string;
    DIALOG_CHANNEL_NOTIFICATION: (channel?: Sendbird.GroupChannel) => string;
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
  STRINGS: {
    USER_NO_NAME: string;
    TYPING_INDICATOR_TYPINGS: (users: Sendbird.User[]) => string | undefined;
  };
  PLACEHOLDER: {
    NO_BANNED_MEMBERS: string;
    NO_CHANNELS: string;
    NO_MESSAGES: string;
    NO_MUTED_MEMBERS: string;
    NO_RESULTS_FOUND: string;
    ERROR_SOMETHING_IS_WRONG: {
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
  };
}

type LabelCreateOptions = {
  dateLocale: Locale;
  overrides?: PartialDeep<LabelSet>;
};

/**
 * Create label set
 * You can create localized labels, you should provide locale for date and string as a parameters
 *
 * @param {LabelCreateOptions.dateLocale} dateLocale Date locale (from date-fns)
 * @param {LabelCreateOptions.overrides} [overrides] Localized label strings
 * */
export const createBaseLabel = ({ dateLocale, overrides }: LabelCreateOptions): LabelSet => ({
  GROUP_CHANNEL: {
    HEADER_TITLE: (currentUserId, channel) => getGroupChannelTitle(currentUserId, channel, '(No name)'),
    LIST_BANNER_FROZEN: 'Channel frozen',
    LIST_DATE_SEPARATOR: (date, locale) => dateSeparator(date, locale),
    LIST_TOOLTIP_NEW_MSG: (newMessages) => `${newMessages.length} new messages`,

    LIST_MESSAGE_TIME: (message, locale) => messageTime(new Date(message.createdAt), locale),
    LIST_MESSAGE_FILE_TITLE: (message) => truncate(message.name, { mode: 'mid', maxLen: 20 }),
    LIST_MESSAGE_EDITED_POSTFIX: ' (Edited)',
    LIST_MESSAGE_UNKNOWN_TITLE: () => '(Unknown message type)',
    LIST_MESSAGE_UNKNOWN_DESC: () => 'Cannot read this message.',

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
  GROUP_CHANNEL_INFO: {
    HEADER_TITLE: 'Channel information',
    HEADER_RIGHT: 'Edit',
    MENU_NOTIFICATION: 'Notification',
    MENU_MEMBERS: 'Members',
    MENU_LEAVE_CHANNEL: 'Leave channel',
    DIALOG_CHANGE_NAME: 'Change channel name',
    DIALOG_CHANGE_IMAGE: 'Change channel image',
    DIALOG_CHANGE_IMAGE_TITLE: 'Change channel image',
    DIALOG_CHANGE_IMAGE_CAMERA: 'Take photo',
    DIALOG_CHANGE_IMAGE_PHOTO_LIBRARY: 'Choose photo',
    DIALOG_CHANGE_NAME_TITLE: 'Change name',
    DIALOG_CHANGE_NAME_PLACEHOLDER: 'Enter name',
    DIALOG_CHANGE_NAME_OK: 'Save',
    DIALOG_CHANGE_NAME_CANCEL: 'Cancel',
    ...overrides?.GROUP_CHANNEL_INFO,
  },
  GROUP_CHANNEL_LIST: {
    HEADER_TITLE: 'Channels',
    PREVIEW_TITLE: (currentUserId, channel) => getGroupChannelTitle(currentUserId, channel, '(No name)'),
    PREVIEW_TITLE_CAPTION: (channel) => getGroupChannelPreviewTime(channel, dateLocale),
    PREVIEW_BODY: (channel) => getGroupChannelLastMessage(channel),
    TYPE_SELECTOR_HEADER_TITLE: 'Channel type',
    TYPE_SELECTOR_GROUP: 'Group',
    TYPE_SELECTOR_SUPER_GROUP: 'Super group',
    TYPE_SELECTOR_BROADCAST: 'Broadcast',
    DIALOG_CHANNEL_TITLE: (currentUserId, channel) => getGroupChannelTitle(currentUserId, channel, '(No name)'),
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
    HEADER_TITLE: 'Select members',
    HEADER_RIGHT: ({ selectedUsers }) => {
      const len = selectedUsers.length;
      if (len === 0) return 'Create';
      return `${len} Create`;
    },
    ...overrides?.GROUP_CHANNEL_CREATE,
  },
  GROUP_CHANNEL_INVITE: {
    HEADER_TITLE: 'Invite members',
    HEADER_RIGHT: ({ selectedUsers }) => {
      const len = selectedUsers.length;
      if (len === 0) return 'Invite';
      return `${len} Invite`;
    },
    ...overrides?.GROUP_CHANNEL_INVITE,
  },
  STRINGS: {
    USER_NO_NAME: '(No name)',
    TYPING_INDICATOR_TYPINGS: (users, NO_NAME = '(No name)') => {
      const userNames = users.map((u) => u.nickname || NO_NAME);
      if (userNames.length === 0) return;
      if (userNames.length === 1) return `${userNames[0]} is typing...`;
      if (users.length === 2) return `${userNames.join(' and ')} are typing...`;
      return 'Several people are typing...';
    },
    ...overrides?.STRINGS,
  },
  PLACEHOLDER: {
    NO_BANNED_MEMBERS: 'No banned members',
    NO_CHANNELS: 'There are no channels',
    NO_MESSAGES: 'There are no messages',
    NO_MUTED_MEMBERS: 'No muted members',
    NO_RESULTS_FOUND: 'No results found',
    ...overrides?.PLACEHOLDER,
    ERROR_SOMETHING_IS_WRONG: {
      MESSAGE: 'Something is wrong',
      RETRY_LABEL: 'Retry',
      ...overrides?.PLACEHOLDER?.ERROR_SOMETHING_IS_WRONG,
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
    ...overrides?.TOAST,
  },
});
