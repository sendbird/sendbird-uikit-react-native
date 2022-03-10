import type Sendbird from 'sendbird';

import type { SendbirdMessage } from '@sendbird/uikit-utils';

export interface CustomQueryInterface<Data> {
  isLoading: boolean;
  next: () => Promise<Data[]>;
  hasNext: boolean;
}
export interface CustomBidirectionalQueryInterface<Data> {
  isLoading: boolean;
  next: () => Promise<Data[]>;
  hasNext: () => boolean;
  prev: () => Promise<Data[]>;
  hasPrev: () => boolean;
}

// useGroupChannelList
export interface UseGroupChannelList {
  loading: boolean;

  refreshing: boolean;
  refresh: () => Promise<void>;

  update: (channel: Sendbird.GroupChannel) => void;
  groupChannels: Sendbird.GroupChannel[];
  next: () => Promise<void>;
}
export type UseGroupChannelListOptions = {
  sortComparator?: (a: Sendbird.GroupChannel, b: Sendbird.GroupChannel) => number;
  queryCreator?: () => Sendbird.GroupChannelListQuery;
  collectionCreator?: () => Sendbird.GroupChannelCollection;
};

// useGroupChannelMessages
export interface UseGroupChannelMessages {
  loading: boolean;

  refreshing: boolean;
  refresh: () => Promise<void>;

  messages: SendbirdMessage[];
  prev: () => Promise<void>;

  nextMessages: SendbirdMessage[];
  newMessagesFromNext: SendbirdMessage[];
  next: () => Promise<void>;

  sendFileMessage: (
    params: Sendbird.FileMessageParams,
    onSent?: (message: Sendbird.FileMessage, error?: Sendbird.SendBirdError) => void,
  ) => Sendbird.FileMessage;
  sendUserMessage: (
    params: Sendbird.UserMessageParams,
    onSent?: (message: Sendbird.UserMessage, error?: Sendbird.SendBirdError) => void,
  ) => Sendbird.UserMessage;
  resendMessage: (failedMessage: Sendbird.FileMessage | Sendbird.UserMessage) => Promise<void>;
}
export type UseGroupChannelMessagesOptions = {
  sortComparator?: (a: SendbirdMessage, b: SendbirdMessage) => number;
  queryCreator?: () => Sendbird.PreviousMessageListQuery;
  collectionCreator?: () => Sendbird.MessageCollection;
};

// useUserList
export interface UseUserList<User> {
  loading: boolean;

  refreshing: boolean;
  refresh: () => Promise<void>;

  users: User[];
  next: () => Promise<void>;
}
export type UseUserListOptions<User> = {
  sortComparator?: (a: User, b: User) => number;
  queryCreator?: () => CustomQueryInterface<User>;
};
