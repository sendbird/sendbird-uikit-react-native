import { getGroupChannelLastMessage, getGroupChannelPreviewTime, getGroupChannelTitle } from '@sendbird/uikit-utils';

import type { LanguageSet } from './language.type';

const LanguageEn: LanguageSet = {
  GROUP_CHANNEL: {
    LIST: {
      HEADER: {
        TITLE: 'Channels',
      },
      PREVIEW: {
        TITLE: (currentUserId, channel) => getGroupChannelTitle(currentUserId, channel),
        TITLE_CAPTION: (channel) => getGroupChannelPreviewTime(channel),
        BODY: (channel) => getGroupChannelLastMessage(channel),
      },
    },
    CREATE: {
      SELECT_TYPE: {
        HEADER: {
          TITLE: 'Channel type',
        },
        SELECTOR: {
          GROUP: 'Group',
          SUPER_GROUP: 'Super group',
          BROADCAST: 'Broadcast',
        },
      },
      SELECT_MEMBER: {
        HEADER: {
          RIGHT(params) {
            const len = params.selectedMembers.length;
            if (len === 0) return 'Create';
            return `${len} Create`;
          },
          TITLE: 'Select members',
        },
      },
    },
  },
};

export default LanguageEn;
