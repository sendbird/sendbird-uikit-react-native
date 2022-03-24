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

/**
 * @interface UseGroupChannelList
 * interface for group channel list hook
 * */
export interface UseGroupChannelList {
  /**
   * Loading state, only available on first render
   * */
  loading: boolean;

  /**
   * Refreshing state, status is changes when the refresh is called.
   * */
  refreshing: boolean;

  /**
   * Refresh, clear and reload messages from latest
   * @return {Promise<void>}
   * */
  refresh: () => Promise<void>;

  /**
   * Update channel, update or insert channel to state
   * @param {Sendbird.GroupChannel} channel
   * @return {void}
   * */
  update: (channel: Sendbird.GroupChannel) => void;

  /**
   * Get group channels state
   * */
  groupChannels: Sendbird.GroupChannel[];

  /**
   * Fetch next channels to state
   * @return {Promise<void>}
   * */
  next: () => Promise<void>;
}
export type UseGroupChannelListOptions = {
  sortComparator?: (a: Sendbird.GroupChannel, b: Sendbird.GroupChannel) => number;
  queryCreator?: () => Sendbird.GroupChannelListQuery;
  collectionCreator?: () => Sendbird.GroupChannelCollection;
  enableCollectionWithoutLocalCache?: boolean;
};

/**
 * @interface UseGroupChannelMessages
 * interface for group channel messages hook
 * - Receive new messages from other users -> append to state(nextMessages)
 * - onTopReached -> prev() -> fetch prev messages and append to state(messages)
 * - onBottomReached -> next() -> nextMessages append to state(messages)
 * */
export interface UseGroupChannelMessages {
  /**
   * Loading state, only available on first render
   * */
  loading: boolean;

  /**
   * Refreshing state, status is changes when the refresh is called.
   * */
  refreshing: boolean;

  /**
   * Refresh, clear and reload messages from latest
   * @return {Promise<void>}
   * */
  refresh: () => Promise<void>;

  /**
   * Get messages, this state is for render
   * For example, if a user receives a new messages while searching for an old message
   * for this case, new messages will be included here.
   * @return {SendbirdMessage[]}
   * */
  messages: SendbirdMessage[];

  /**
   * Fetch prev messages to state
   * @return {Promise<void>}
   * */
  prev: () => Promise<void>;

  /**
   * Get messages, this state is for temporary data before render
   * For example, if a user receives a new messages while searching for an old message
   * for this case, new messages will be included here.
   * */
  nextMessages: SendbirdMessage[];

  /**
   * Get new messages from nextMessages
   * A new message means a message that meets the below conditions
   * - Not admin message
   * - Not updated message
   * - Not current user's message
   * */
  newMessagesFromNext: SendbirdMessage[];

  /**
   * Fetch next messages to state
   * @return {Promise<void>}
   * */
  next: () => Promise<void>;

  /**
   * Send file message
   * @param params file message params
   * @param callback sent message callback
   * @return pending message
   * */
  sendFileMessage: (
    params: Sendbird.FileMessageParams,
    onSent?: (message: Sendbird.FileMessage, error?: Sendbird.SendBirdError) => void,
  ) => Sendbird.FileMessage;

  /**
   * Send user message
   * @param params user message params
   * @param callback sent message callback
   * @return pending message
   * */
  sendUserMessage: (
    params: Sendbird.UserMessageParams,
    onSent?: (message: Sendbird.UserMessage, error?: Sendbird.SendBirdError) => void,
  ) => Sendbird.UserMessage;

  /**
   * Resend failed message
   * @param failedMessage failed message to resend
   * @return {Promise<void>}
   * */
  resendMessage: (failedMessage: Sendbird.FileMessage | Sendbird.UserMessage) => Promise<void>;

  /**
   * Activated channel
   * */
  activeChannel: Sendbird.GroupChannel;
}

export type UseGroupChannelMessagesOptions = {
  sortComparator?: (a: SendbirdMessage, b: SendbirdMessage) => number;
  queryCreator?: () => Sendbird.PreviousMessageListQuery;
  collectionCreator?: () => Sendbird.MessageCollection;
  enableCollectionWithoutLocalCache?: boolean;
};

/**
 * @interface UseUserList
 * interface for user list hook
 * */
export interface UseUserList<User> {
  /**
   * Loading state, only available on first render
   * */
  loading: boolean;

  /**
   * Refreshing state, status is changes when the refresh is called.
   * */
  refreshing: boolean;

  /**
   * Refresh, clear and reload messages from latest
   * @return {Promise<void>}
   * */
  refresh: () => Promise<void>;

  /**
   * Get users state
   * */
  users: User[];

  /**
   * Fetch next users to state
   * @return {Promise<void>}
   * */
  next: () => Promise<void>;
}
export type UseUserListOptions<User> = {
  sortComparator?: (a: User, b: User) => number;
  queryCreator?: () => CustomQueryInterface<User>;
};
