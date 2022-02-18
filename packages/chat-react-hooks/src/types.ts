import type Sendbird from 'sendbird';

export interface UseGroupChannelList {
  groupChannels: Sendbird.GroupChannel[];
  update: (channel: Sendbird.GroupChannel) => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  refreshing: boolean;
}
export type UseGroupChannelListOptions = {
  sortComparator?: (a: Sendbird.GroupChannel, b: Sendbird.GroupChannel) => number;
  queryFactory?: () => Sendbird.GroupChannelListQuery;
};

export type SendbirdChatSDK = Sendbird.SendBirdInstance;
