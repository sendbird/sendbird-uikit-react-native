import type Sendbird from 'sendbird';

export type FilterByValueType<T extends object, Type> = {
  [K in keyof T as T[K] extends Type ? K : never]: T[K];
};

export interface GroupChannelListHook {
  groupChannels: Sendbird.GroupChannel[];
  update: (channel: Sendbird.GroupChannel) => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export type SendbirdChatSDK = Sendbird.SendBirdInstance;
