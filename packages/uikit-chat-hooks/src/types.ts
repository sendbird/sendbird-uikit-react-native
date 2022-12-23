import type {
  SendbirdChatSDK,
  SendbirdError,
  SendbirdFileMessage,
  SendbirdFileMessageCreateParams,
  SendbirdGroupChannel,
  SendbirdGroupChannelCollection,
  SendbirdGroupChannelListQuery,
  SendbirdMessage,
  SendbirdMessageCollection,
  SendbirdPreviousMessageListQuery,
  SendbirdUserMessage,
  SendbirdUserMessageCreateParams,
  UserStruct,
} from '@sendbird/uikit-utils';

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
 * @description interface for group channel list hook
 * */
export interface UseGroupChannelList {
  (sdk: SendbirdChatSDK, userId?: string, options?: UseGroupChannelListOptions): {
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
     * Get group channels state
     * */
    groupChannels: SendbirdGroupChannel[];

    /**
     * Fetch next channels to state
     * @return {Promise<void>}
     * */
    next: () => Promise<void>;
  };
}
export type UseGroupChannelListOptions = {
  queryCreator?: () => SendbirdGroupChannelListQuery;
  collectionCreator?: () => SendbirdGroupChannelCollection;
  enableCollectionWithoutLocalCache?: boolean;
};

/**
 * @interface UseGroupChannelMessages
 * @description interface for group channel messages hook
 * - Receive new messages from other users -> append to state(nextMessages)
 * - onTopReached -> prev() -> fetch prev messages and append to state(messages)
 * - onBottomReached -> next() -> nextMessages append to state(messages)
 * */
export interface UseGroupChannelMessages {
  (sdk: SendbirdChatSDK, channel: SendbirdGroupChannel, userId?: string, options?: UseGroupChannelMessagesOptions): {
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
    newMessagesFromMembers: SendbirdMessage[];

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
      params: SendbirdFileMessageCreateParams,
      onPending?: (message: SendbirdFileMessage, error?: SendbirdError) => void,
    ) => Promise<SendbirdFileMessage>;

    /**
     * Send user message
     * @param params user message params
     * @param callback sent message callback
     * @return pending message
     * */
    sendUserMessage: (
      params: SendbirdUserMessageCreateParams,
      onPending?: (message: SendbirdUserMessage, error?: SendbirdError) => void,
    ) => Promise<SendbirdUserMessage>;

    /**
     * Update file message
     * @param messageId
     * @param params file message params
     * @return updated message
     * */
    updateFileMessage: (messageId: number, params: SendbirdFileMessageCreateParams) => Promise<SendbirdFileMessage>;

    /**
     * Update user message
     * @param messageId
     * @param params user message params
     * @return updated message
     * */
    updateUserMessage: (messageId: number, params: SendbirdUserMessageCreateParams) => Promise<SendbirdUserMessage>;

    /**
     * Resend failed message
     * @param failedMessage failed message to resend
     * @return {Promise<void>}
     * */
    resendMessage: (failedMessage: SendbirdFileMessage | SendbirdUserMessage) => Promise<void>;

    /**
     * Delete message
     * @param message sent or failed message
     * @return {Promise<void>}
     * */
    deleteMessage: (message: SendbirdFileMessage | SendbirdUserMessage) => Promise<void>;
  };
}

export type UseGroupChannelMessagesOptions = {
  sortComparator?: (a: SendbirdMessage, b: SendbirdMessage) => number;
  queryCreator?: () => SendbirdPreviousMessageListQuery;
  collectionCreator?: () => SendbirdMessageCollection;
  enableCollectionWithoutLocalCache?: boolean;
  onChannelDeleted?: () => void;
};

/**
 * @interface UseUserListReturn
 * @description interface for user list hook return value
 * */
export interface UseUserListReturn<User extends UserStruct> {
  /**
   * Loading state, only available on first render
   * */
  loading: boolean;

  /**
   * Refreshing state, status is changes when the refresh is called.
   * */
  refreshing: boolean;

  /**
   * Error state
   * */
  error: unknown | null;

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
   * Update or Insert user to list
   * */
  upsertUser: (user: User) => void;

  /**
   * Delete user from list
   * */
  deleteUser: (userId: User['userId']) => void;

  /**
   * Fetch next users to state
   * @return {Promise<void>}
   * */
  next: () => Promise<void>;
}

export type UseUserListOptions<User extends UserStruct> = {
  sortComparator?: (a: User, b: User) => number;
  queryCreator?: () => CustomQueryInterface<User>;
};
