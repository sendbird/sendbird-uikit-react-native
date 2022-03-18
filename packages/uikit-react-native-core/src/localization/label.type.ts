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

export type LabelLocale = 'en';

/**
 * LabelSet interface
 * Do not configure over 3 depths (for overrides easy)
 * */
export interface LabelSet {
  GROUP_CHANNEL: {
    FRAGMENT: {
      /** @domain GroupChannel > Fragment > Header > Title */
      HEADER_TITLE: (currentUserId: string, channel: Sendbird.GroupChannel) => string;
      /** @domain GroupChannel > Fragment > List > Banner frozen */
      LIST_BANNER_FROZEN: string;
      /** @domain GroupChannel > Fragment > List > Date separator */
      LIST_DATE_SEPARATOR: (date: Date, locale?: Locale) => string;
      /** @domain GroupChannel > Fragment > List > Tooltip > New messages */
      LIST_TOOLTIP_NEW_MSG: (newMessages: SendbirdMessage[]) => string;

      /** @domain GroupChannel > Fragment > List > Message > Time */
      LIST_MESSAGE_TIME: (message: SendbirdMessage, locale?: Locale) => string;
      /** @domain GroupChannel > Fragment > List > Message > File title */
      LIST_MESSAGE_FILE_TITLE: (message: Sendbird.FileMessage) => string;
      /** @domain GroupChannel > Fragment > List > Message > Edited postfix */
      LIST_MESSAGE_EDITED_POSTFIX: string;
      /** @domain GroupChannel > Fragment > List > Message > Unknown title */
      LIST_MESSAGE_UNKNOWN_TITLE: (message: SendbirdMessage) => string;
      /** @domain GroupChannel > Fragment > List > Message > Unknown description */
      LIST_MESSAGE_UNKNOWN_DESC: (message: SendbirdMessage) => string;

      /** @domain GroupChannel > Fragment > Input > Placeholder active */
      INPUT_PLACEHOLDER_ACTIVE: string;
      /** @domain GroupChannel > Fragment > Input > Placeholder disabled */
      INPUT_PLACEHOLDER_DISABLED: string;
      /** @domain GroupChannel > Fragment > Input > Edit ok */
      INPUT_EDIT_OK: string;
      /** @domain GroupChannel > Fragment > Input > Edit cancel */
      INPUT_EDIT_CANCEL: string;

      /** @domain GroupChannel > Fragment > Dialog > Message > Copy */
      DIALOG_MESSAGE_COPY: string;
      /** @domain GroupChannel > Fragment > Dialog > Message > Edit */
      DIALOG_MESSAGE_EDIT: string;
      /** @domain GroupChannel > Fragment > Dialog > Message > Save */
      DIALOG_MESSAGE_SAVE: string;
      /** @domain GroupChannel > Fragment > Dialog > Message > Delete */
      DIALOG_MESSAGE_DELETE: string;
      /** @domain GroupChannel > Fragment > Dialog > Message > Delete > Confirm title */
      DIALOG_MESSAGE_DELETE_CONFIRM_TITLE: string;
      /** @domain GroupChannel > Fragment > Dialog > Message > Delete > Confirm ok */
      DIALOG_MESSAGE_DELETE_CONFIRM_OK: string;
      /** @domain GroupChannel > Fragment > Dialog > Message > Delete > Confirm cancel */
      DIALOG_MESSAGE_DELETE_CONFIRM_CANCEL: string;
      /** @domain GroupChannel > Fragment > Dialog > Message > Failed > Retry */
      DIALOG_MESSAGE_FAILED_RETRY: string;
      /** @domain GroupChannel > Fragment > Dialog > Message > Failed > Remove */
      DIALOG_MESSAGE_FAILED_REMOVE: string;

      /** @domain GroupChannel > Fragment > Dialog > Attachment > Camera */
      DIALOG_ATTACHMENT_CAMERA: string;
      /** @domain GroupChannel > Fragment > Dialog > Attachment > Photo */
      DIALOG_ATTACHMENT_PHOTO_LIBRARY: string;
      /** @domain GroupChannel > Fragment > Dialog > Attachment > Files */
      DIALOG_ATTACHMENT_FILES: string;
    };
  };
  GROUP_CHANNEL_LIST: {
    FRAGMENT: {
      /** @domain GroupChannelList > Fragment > Header > Title */
      HEADER_TITLE: string;
      /** @domain GroupChannelList > Fragment > Preview > Title */
      PREVIEW_TITLE: (currentUserId: string, channel: Sendbird.GroupChannel) => string;
      /** @domain GroupChannelList > Fragment > Preview > TitleCaption */
      PREVIEW_TITLE_CAPTION: (channel: Sendbird.GroupChannel) => string;
      /** @domain GroupChannelList > Fragment > Preview > Message */
      PREVIEW_BODY: (channel: Sendbird.GroupChannel) => string;
    };
    TYPE_SELECTOR: {
      /** @domain GroupChannelList > TypeSelector > Header > Title */
      HEADER_TITLE: string;
      /** @domain GroupChannelList > TypeSelector > Group */
      GROUP: string;
      /** @domain GroupChannelList > TypeSelector > SuperGroup */
      SUPER_GROUP: string;
      /** @domain GroupChannelList > TypeSelector > Broadcast */
      BROADCAST: string;
    };
    CHANNEL_MENU: {
      /** @domain GroupChannelList > ChannelMenu > Title */
      TITLE: (currentUserId: string, channel: Sendbird.GroupChannel) => string;
      /** @domain GroupChannelList > ChannelMenu > Menu */
      MENU_NOTIFICATIONS: (channel?: Sendbird.GroupChannel) => string;
      /** @domain GroupChannelList > ChannelMenu > Menu */
      MENU_LEAVE_CHANNEL: string;
    };
  };
  INVITE_MEMBERS: {
    /** @domain InviteMembers > Header > Title */
    HEADER_TITLE: string;
    /** @domain InviteMembers > Header > Right */
    HEADER_RIGHT: <T>(params: { selectedUsers: Array<T> }) => string;
    /** @domain InviteMembers > User > No name */
    USER_NO_NAME: string;
  };
  // UI
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
    FRAGMENT: {
      HEADER_TITLE: (currentUserId, channel) => getGroupChannelTitle(currentUserId, channel),
      LIST_BANNER_FROZEN: 'Channel frozen',
      LIST_DATE_SEPARATOR: (date, locale) => dateSeparator(date, locale),
      LIST_TOOLTIP_NEW_MSG: (newMessages) => `${newMessages.length} new messages`,

      LIST_MESSAGE_TIME: (message, locale) => messageTime(new Date(message.createdAt), locale),
      LIST_MESSAGE_FILE_TITLE: (message) => truncate(message.name, { mode: 'mid', maxLen: 20 }),
      LIST_MESSAGE_EDITED_POSTFIX: '(Edited)',
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

      ...overrides?.GROUP_CHANNEL?.FRAGMENT,
    },
  },
  GROUP_CHANNEL_LIST: {
    FRAGMENT: {
      HEADER_TITLE: 'Channels',
      PREVIEW_TITLE: (currentUserId, channel) => getGroupChannelTitle(currentUserId, channel),
      PREVIEW_TITLE_CAPTION: (channel) => getGroupChannelPreviewTime(channel, dateLocale),
      PREVIEW_BODY: (channel) => getGroupChannelLastMessage(channel),
      ...overrides?.GROUP_CHANNEL_LIST?.FRAGMENT,
    },
    TYPE_SELECTOR: {
      HEADER_TITLE: 'Channel type',
      GROUP: 'Group',
      SUPER_GROUP: 'Super group',
      BROADCAST: 'Broadcast',
      ...overrides?.GROUP_CHANNEL_LIST?.TYPE_SELECTOR,
    },
    CHANNEL_MENU: {
      TITLE: (currentUserId, channel) => getGroupChannelTitle(currentUserId, channel),
      MENU_NOTIFICATIONS: (channel) => {
        if (!channel) return '';
        if (channel.myPushTriggerOption === 'off') return 'Turn on notifications';
        return 'Turn off notifications';
      },
      MENU_LEAVE_CHANNEL: 'Leave channel',
      ...overrides?.GROUP_CHANNEL_LIST?.CHANNEL_MENU,
    },
  },
  INVITE_MEMBERS: {
    HEADER_TITLE: 'Select members',
    HEADER_RIGHT: ({ selectedUsers }) => {
      const len = selectedUsers.length;
      if (len === 0) return 'Create';
      return `${len} Create`;
    },
    USER_NO_NAME: '(No name)',
    ...overrides?.INVITE_MEMBERS,
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
});
