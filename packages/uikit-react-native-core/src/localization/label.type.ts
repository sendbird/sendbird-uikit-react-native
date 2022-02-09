import type Sendbird from 'sendbird';

import { getGroupChannelLastMessage, getGroupChannelPreviewTime, getGroupChannelTitle } from '@sendbird/uikit-utils';
import type { PartialDeep } from '@sendbird/uikit-utils/src/types';

export type LabelLocale = 'en';

/**
 * LabelSet interface
 * Do not configure over 3 depths (for overrides easy)
 * */
export interface LabelSet {
  GROUP_CHANNEL: {
    LIST: {
      /** @domain GroupChannelList > Header > Title */
      HEADER_TITLE: string;
      /** @domain GroupChannelList > Preview > Title */
      PREVIEW_TITLE: (currentUserId: string, channel: Sendbird.GroupChannel) => string;
      /** @domain GroupChannelList > Preview > TitleCaption */
      PREVIEW_TITLE_CAPTION: (channel: Sendbird.GroupChannel) => string;
      /** @domain GroupChannelList > Preview > Message */
      PREVIEW_BODY: (channel: Sendbird.GroupChannel) => string;
    };
    CREATE_SELECT_TYPE: {
      /** @domain GroupChannelListCreate > Header > Title */
      HEADER_TITLE: string;
      /** @domain GroupChannelListCreate > TypeSelector > Group */
      SELECTOR_GROUP: string;
      /** @domain GroupChannelListCreate > TypeSelector > SuperGroup */
      SELECTOR_SUPER_GROUP: string;
      /** @domain GroupChannelListCreate > TypeSelector > Broadcast */
      SELECTOR_BROADCAST: string;
    };
    CREATE_SELECT_MEMBER: {
      /** @domain GroupChannelListCreate > Header > Title */
      HEADER_TITLE: string;
      /** @domain GroupChannelListCreate > Header > Right */
      HEADER_RIGHT: (params: { selectedMembers: Array<Sendbird.Member | Sendbird.User> }) => string;
    };
  };
}

type LabelCreateOptions = {
  dateLocale: Locale;
  overrides?: PartialDeep<LabelSet>;
};

export const createBaseLabel = ({ dateLocale, overrides }: LabelCreateOptions): LabelSet => ({
  GROUP_CHANNEL: {
    LIST: {
      HEADER_TITLE: 'Channels',
      PREVIEW_TITLE: (currentUserId, channel) => getGroupChannelTitle(currentUserId, channel),
      PREVIEW_TITLE_CAPTION: (channel) => getGroupChannelPreviewTime(channel, dateLocale),
      PREVIEW_BODY: (channel) => getGroupChannelLastMessage(channel),
      ...overrides?.GROUP_CHANNEL?.LIST,
    },
    CREATE_SELECT_TYPE: {
      HEADER_TITLE: 'Channel type',
      SELECTOR_GROUP: 'Group',
      SELECTOR_SUPER_GROUP: 'Super group',
      SELECTOR_BROADCAST: 'Broadcast',
      ...overrides?.GROUP_CHANNEL?.CREATE_SELECT_TYPE,
    },
    CREATE_SELECT_MEMBER: {
      HEADER_TITLE: 'Select members',
      HEADER_RIGHT: ({ selectedMembers }) => {
        const len = selectedMembers.length;
        if (len === 0) return 'Create';
        return `${len} Create`;
      },
      ...overrides?.GROUP_CHANNEL?.CREATE_SELECT_TYPE,
    },
  },
});
