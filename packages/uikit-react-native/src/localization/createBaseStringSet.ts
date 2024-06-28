import type { Locale } from 'date-fns';

import { PartialDeep, SendbirdMessage, getThreadParentMessageTimeFormat } from '@sendbird/uikit-utils';
import {
  getDateSeparatorFormat,
  getGroupChannelPreviewTime,
  getGroupChannelTitle,
  getMessagePreviewBody,
  getMessagePreviewTime,
  getMessagePreviewTitle,
  getMessageTimeFormat,
  getMessageType,
  getOpenChannelParticipants,
  getOpenChannelTitle,
  getReplyCountFormat,
  isVoiceMessage,
} from '@sendbird/uikit-utils';

import { UNKNOWN_USER_ID } from '../constants';
import type { StringSet } from './StringSet.type';

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
    OPEN_CHANNEL: {
      HEADER_TITLE: (channel) => getOpenChannelTitle(channel),
      HEADER_SUBTITLE: (channel) => getOpenChannelParticipants(channel),
      LIST_DATE_SEPARATOR: (date, locale) => getDateSeparatorFormat(date, locale ?? dateLocale),
      MESSAGE_BUBBLE_TIME: (message, locale) => getMessageTimeFormat(new Date(message.createdAt), locale ?? dateLocale),
      MESSAGE_BUBBLE_FILE_TITLE: (message) => message.name,
      MESSAGE_BUBBLE_EDITED_POSTFIX: ' (edited)',
      MESSAGE_BUBBLE_UNKNOWN_TITLE: () => '(Unknown message type)',
      MESSAGE_BUBBLE_UNKNOWN_DESC: () => 'Cannot read this message.',
      ...overrides?.OPEN_CHANNEL,
    },
    OPEN_CHANNEL_PARTICIPANTS: {
      HEADER_TITLE: 'Participants',
      ...overrides?.OPEN_CHANNEL_PARTICIPANTS,
    },
    OPEN_CHANNEL_SETTINGS: {
      HEADER_TITLE: 'Channel information',
      HEADER_RIGHT: 'Edit',
      INFO_URL: 'URL',
      MENU_MODERATION: 'Moderation',
      MENU_PARTICIPANTS: 'Participants',
      MENU_DELETE_CHANNEL: 'Delete channel',
      DIALOG_CHANNEL_DELETE_CONFIRM_TITLE: 'Delete channel?',
      DIALOG_CHANNEL_DELETE_CONFIRM_OK: 'Delete',
      DIALOG_CHANNEL_DELETE_CONFIRM_CANCEL: 'Cancel',
      DIALOG_CHANGE_NAME: 'Change channel name',
      DIALOG_CHANGE_NAME_PROMPT_TITLE: 'Change channel name',
      DIALOG_CHANGE_NAME_PROMPT_PLACEHOLDER: 'Enter name',
      DIALOG_CHANGE_NAME_PROMPT_OK: 'Save',
      DIALOG_CHANGE_NAME_PROMPT_CANCEL: 'Cancel',
      DIALOG_CHANGE_IMAGE: 'Change channel image',
      DIALOG_CHANGE_IMAGE_MENU_TITLE: 'Change channel image',
      DIALOG_CHANGE_IMAGE_MENU_CAMERA: 'Take photo',
      DIALOG_CHANGE_IMAGE_MENU_PHOTO_LIBRARY: 'Choose photo',
      ...overrides?.OPEN_CHANNEL_SETTINGS,
    },
    OPEN_CHANNEL_LIST: {
      HEADER_TITLE: 'Channels',
      CHANNEL_PREVIEW_TITLE: (channel) => getOpenChannelTitle(channel),
      ...overrides?.OPEN_CHANNEL_LIST,
    },
    OPEN_CHANNEL_CREATE: {
      HEADER_TITLE: 'New channel',
      HEADER_RIGHT: 'Create',
      PLACEHOLDER: 'Enter channel name',
      DIALOG_IMAGE_MENU_REMOVE: 'Remove photo',
      DIALOG_IMAGE_MENU_CAMERA: 'Take photo',
      DIALOG_IMAGE_MENU_PHOTO_LIBRARY: 'Choose photo',
      ...overrides?.OPEN_CHANNEL_CREATE,
    },
    OPEN_CHANNEL_MODERATION: {
      HEADER_TITLE: 'Moderation',
      MENU_OPERATORS: 'Operators',
      MENU_MUTED_PARTICIPANTS: 'Muted participants',
      MENU_BANNED_USERS: 'Banned users',
      ...overrides?.OPEN_CHANNEL_MODERATION,
    },
    OPEN_CHANNEL_BANNED_USERS: {
      HEADER_TITLE: 'Banned users',
      ...overrides?.OPEN_CHANNEL_BANNED_USERS,
    },
    OPEN_CHANNEL_MUTED_PARTICIPANTS: {
      HEADER_TITLE: 'Muted participants',
      ...overrides?.OPEN_CHANNEL_MUTED_PARTICIPANTS,
    },
    OPEN_CHANNEL_OPERATORS: {
      HEADER_TITLE: 'Operators',
      ...overrides?.OPEN_CHANNEL_OPERATORS,
    },
    OPEN_CHANNEL_REGISTER_OPERATOR: {
      HEADER_TITLE: 'Set as operators',
      HEADER_RIGHT: ({ selectedUsers }) => {
        const len = selectedUsers.length;
        if (len === 0) return 'Add';
        return `Add (${len})`;
      },
      ...overrides?.OPEN_CHANNEL_REGISTER_OPERATOR,
    },
    GROUP_CHANNEL: {
      HEADER_TITLE: (uid, channel) => getGroupChannelTitle(uid, channel, USER_NO_NAME, CHANNEL_NO_MEMBERS),
      LIST_DATE_SEPARATOR: (date, locale) => getDateSeparatorFormat(date, locale ?? dateLocale),
      LIST_BUTTON_NEW_MSG: (newMessages) => `${newMessages.length} new messages`,

      MESSAGE_BUBBLE_TIME: (message, locale) => getMessageTimeFormat(new Date(message.createdAt), locale ?? dateLocale),
      MESSAGE_BUBBLE_FILE_TITLE: (message) => message.name,
      MESSAGE_BUBBLE_EDITED_POSTFIX: ' (edited)',
      MESSAGE_BUBBLE_UNKNOWN_TITLE: () => '(Unknown message type)',
      MESSAGE_BUBBLE_UNKNOWN_DESC: () => 'Cannot read this message.',

      MENTION_LIMITED: (mentionLimit) => `You can have up to ${mentionLimit} mentions per message.`,
      ...overrides?.GROUP_CHANNEL,
    },
    GROUP_CHANNEL_THREAD: {
      HEADER_TITLE: 'Thread',
      HEADER_SUBTITLE: (uid, channel) => getGroupChannelTitle(uid, channel, USER_NO_NAME, CHANNEL_NO_MEMBERS),
      LIST_DATE_SEPARATOR: (date, locale) => getDateSeparatorFormat(date, locale ?? dateLocale),
      LIST_BUTTON_NEW_MSG: (newMessages) => `${newMessages.length} new messages`,

      MESSAGE_BUBBLE_TIME: (message, locale) => getMessageTimeFormat(new Date(message.createdAt), locale ?? dateLocale),
      MESSAGE_BUBBLE_FILE_TITLE: (message) => message.name,
      MESSAGE_BUBBLE_EDITED_POSTFIX: ' (edited)',
      MESSAGE_BUBBLE_UNKNOWN_TITLE: () => '(Unknown message type)',
      MESSAGE_BUBBLE_UNKNOWN_DESC: () => 'Cannot read this message.',

      PARENT_MESSAGE_TIME: (message: SendbirdMessage, locale?: Locale) =>
        getThreadParentMessageTimeFormat(new Date(message.createdAt), locale ?? dateLocale),
      REPLY_COUNT: (replyCount: number, maxReplyCount?: number) => getReplyCountFormat(replyCount, maxReplyCount),

      MENTION_LIMITED: (mentionLimit) => `You can have up to ${mentionLimit} mentions per message.`,
      ...overrides?.GROUP_CHANNEL_THREAD,
    },
    GROUP_CHANNEL_SETTINGS: {
      HEADER_TITLE: 'Channel information',
      HEADER_RIGHT: 'Edit',
      MENU_MODERATION: 'Moderation',
      MENU_MEMBERS: 'Members',
      MENU_SEARCH: 'Search in channel',
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
      CHANNEL_PREVIEW_BODY: (channel) => {
        if (!channel.lastMessage) return '';
        if (isVoiceMessage(channel.lastMessage)) return 'Voice message';
        return getMessagePreviewBody(channel.lastMessage);
      },
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
    MESSAGE_SEARCH: {
      HEADER_INPUT_PLACEHOLDER: 'Search',
      HEADER_RIGHT: 'Search',
      SEARCH_RESULT_ITEM_TITLE: (message) => getMessagePreviewTitle(message),
      SEARCH_RESULT_ITEM_BODY: (message) => {
        if (isVoiceMessage(message)) return 'Voice message';
        return getMessagePreviewBody(message);
      },
      SEARCH_RESULT_ITEM_TITLE_CAPTION: (message, locale) => {
        return getMessagePreviewTime(message.createdAt, locale ?? dateLocale);
      },
    },
    LABELS: {
      PERMISSION_APP_NAME: 'Application',
      PERMISSION_CAMERA: 'camera',
      PERMISSION_DEVICE_STORAGE: 'device storage',
      PERMISSION_MICROPHONE: 'microphone',
      USER_NO_NAME,
      CHANNEL_NO_MEMBERS,
      TYPING_INDICATOR_TYPINGS: (users, NO_NAME = USER_NO_NAME) => {
        const userNames = users.map((u) => u.nickname || NO_NAME);
        if (userNames.length === 0) return;
        if (userNames.length === 1) return `${userNames[0]} is typing...`;
        if (users.length === 2) return `${userNames.join(' and ')} are typing...`;
        return 'Several people are typing...';
      },
      REPLY_FROM_SENDER_TO_RECEIVER: (reply, parent, currentUserId = UNKNOWN_USER_ID) => {
        const replySenderNickname =
          reply.sender.userId === currentUserId ? 'You' : reply.sender.nickname || USER_NO_NAME;
        const parentSenderNickname =
          parent.sender.userId === currentUserId ? 'You' : parent.sender.nickname || USER_NO_NAME;
        return `${replySenderNickname} replied to ${parentSenderNickname}`;
      },
      MESSAGE_UNAVAILABLE: 'Message unavailable',

      USER_BAR_ME_POSTFIX: ' (You)',
      USER_BAR_OPERATOR: 'Operator',
      REGISTER_AS_OPERATOR: 'Register as operator',
      UNREGISTER_OPERATOR: 'Unregister operator',
      MUTE: 'Mute',
      UNMUTE: 'Unmute',
      BAN: 'Ban',
      UNBAN: 'Unban',
      CHANNEL_MESSAGE_LIST_FROZEN: 'Channel is frozen',
      CHANNEL_MESSAGE_COPY: 'Copy',
      CHANNEL_MESSAGE_EDIT: 'Edit',
      CHANNEL_MESSAGE_SAVE: 'Save',
      CHANNEL_MESSAGE_DELETE: 'Delete',
      CHANNEL_MESSAGE_REPLY: 'Reply',
      CHANNEL_MESSAGE_THREAD: 'Reply in thread',
      CHANNEL_MESSAGE_DELETE_CONFIRM_TITLE: 'Delete message?',
      CHANNEL_MESSAGE_DELETE_CONFIRM_OK: 'Delete',
      CHANNEL_MESSAGE_DELETE_CONFIRM_CANCEL: 'Cancel',
      CHANNEL_MESSAGE_FAILED_RETRY: 'Retry',
      CHANNEL_MESSAGE_FAILED_REMOVE: 'Remove',
      CHANNEL_INPUT_ATTACHMENT_CAMERA_PHOTO: 'Take a photo',
      CHANNEL_INPUT_ATTACHMENT_CAMERA_VIDEO: 'Take a video',
      CHANNEL_INPUT_ATTACHMENT_PHOTO_LIBRARY: 'Photo library',
      CHANNEL_INPUT_ATTACHMENT_FILES: 'Files',
      CHANNEL_INPUT_PLACEHOLDER_ACTIVE: 'Enter message',
      CHANNEL_INPUT_PLACEHOLDER_DISABLED: 'Chat not available in this channel.',
      CHANNEL_INPUT_PLACEHOLDER_MUTED: "You're muted by the operator.",
      CHANNEL_INPUT_PLACEHOLDER_REPLY: 'Reply to message',
      CHANNEL_INPUT_PLACEHOLDER_REPLY_IN_THREAD: 'Reply in thread',
      CHANNEL_INPUT_PLACEHOLDER_REPLY_TO_THREAD: 'Reply to thread',
      CHANNEL_INPUT_EDIT_OK: 'Save',
      CHANNEL_INPUT_EDIT_CANCEL: 'Cancel',
      CHANNEL_INPUT_REPLY_PREVIEW_TITLE: (user) => `Reply to ${user.nickname || USER_NO_NAME}`,
      CHANNEL_INPUT_REPLY_PREVIEW_BODY: (message) => {
        if (message.isFileMessage()) {
          const messageType = getMessageType(message);
          switch (messageType) {
            case 'file.image':
              return message.type.toLowerCase().includes('gif') ? 'GIF' : 'Photo';
            case 'file.video':
              return 'Video';
            case 'file.audio':
              return 'Audio';
            case 'file.voice':
              return 'Voice message';
            default:
              return message.name;
          }
        } else if (message.isUserMessage()) {
          return message.message;
        }
        return 'Unknown message';
      },
      VOICE_MESSAGE: 'Voice message',
      VOICE_MESSAGE_INPUT_CANCEL: 'Cancel',
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
      NO_MUTED_PARTICIPANTS: 'No muted participants',
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
        return `${appName} needs permission to access your ${permission}.`;
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
      USER_MUTED_ERROR: "You're muted by the operator.",
      CHANNEL_FROZEN_ERROR: 'Channel is frozen.',
      UPDATE_MSG_ERROR: "Couldn't edit message.",
      TURN_ON_NOTIFICATIONS_ERROR: "Couldn't turn on notifications.",
      TURN_OFF_NOTIFICATIONS_ERROR: "Couldn't turn off notifications.",
      LEAVE_CHANNEL_ERROR: "Couldn't leave channel.",
      UNKNOWN_ERROR: 'Something went wrong.',
      GET_CHANNEL_ERROR: "Couldn't retrieve channel.",
      FIND_PARENT_MSG_ERROR: "Couldn't find the original message for this reply.",
      THREAD_PARENT_MESSAGE_DELETED_ERROR: "The thread doesn't exist because the parent message was deleted.",
      FILE_UPLOAD_SIZE_LIMIT_EXCEEDED_ERROR: (uploadSizeLimit: string) => {
        return `The maximum size per file is ${uploadSizeLimit}.`;
      },
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
