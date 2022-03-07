import type Sendbird from 'sendbird';

import { getGroupChannelLastMessage, getGroupChannelPreviewTime, getGroupChannelTitle } from '@sendbird/uikit-utils';
import type { PartialDeep } from '@sendbird/uikit-utils';

export type LabelLocale = 'en';

/**
 * LabelSet interface
 * Do not configure over 3 depths (for overrides easy)
 * */
export interface LabelSet {
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
}

type LabelCreateOptions = {
  dateLocale: Locale;
  overrides?: PartialDeep<LabelSet>;
};

export const createBaseLabel = ({ dateLocale, overrides }: LabelCreateOptions): LabelSet => ({
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
});
