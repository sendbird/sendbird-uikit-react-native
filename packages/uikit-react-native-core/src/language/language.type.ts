import type Sendbird from 'sendbird';

export type LanguageLocale = 'en';

export interface LanguageSet {
  GROUP_CHANNEL: {
    LIST: {
      HEADER: {
        /** @domain GroupChannelList > Header > Title */
        TITLE: string;
      };
      PREVIEW: {
        /** @domain GroupChannelList > Preview > Title */
        TITLE: (currentUserId: string, channel: Sendbird.GroupChannel) => string;
        /** @domain GroupChannelList > Preview > TitleCaption */
        TITLE_CAPTION: (channel: Sendbird.GroupChannel) => string;
        /** @domain GroupChannelList > Preview > Message */
        BODY: (channel: Sendbird.GroupChannel) => string;
      };
    };
    CREATE: {
      SELECT_TYPE: {
        HEADER: {
          /** @domain GroupChannelListCreate > Header > Title */
          TITLE: string;
        };
        SELECTOR: {
          /** @domain GroupChannelListCreate > TypeSelector > Group */
          GROUP: string;
          /** @domain GroupChannelListCreate > TypeSelector > SuperGroup */
          SUPER_GROUP: string;
          /** @domain GroupChannelListCreate > TypeSelector > Broadcast */
          BROADCAST: string;
        };
      };
      SELECT_MEMBER: {
        HEADER: {
          /** @domain GroupChannelListCreate > Header > Title */
          TITLE: string;
          /** @domain GroupChannelListCreate > Header > Right */
          RIGHT: (params: { selectedMembers: Array<Sendbird.Member | Sendbird.User> }) => string;
        };
      };
    };
  };
}
