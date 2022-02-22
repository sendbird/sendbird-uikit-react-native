import type Sendbird from 'sendbird';

declare module 'sendbird' {
  interface SendBirdInstance {
    get isCacheEnabled(): boolean;
  }
}

export interface UseGroupChannelList {
  groupChannels: Sendbird.GroupChannel[];
  update: (channel: Sendbird.GroupChannel) => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  refreshing: boolean;
}
export type UseGroupChannelListOptions = {
  sortComparator?: (a: Sendbird.GroupChannel, b: Sendbird.GroupChannel) => number;
  queryCreator?: () => Sendbird.GroupChannelListQuery;
  collectionCreator?: () => Sendbird.GroupChannelCollection;
};

export type SendbirdChatSDK = Sendbird.SendBirdInstance;
