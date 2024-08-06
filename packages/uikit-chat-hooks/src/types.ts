import type { ReplyType } from '@sendbird/chat/message';
import type {
  SendbirdChatSDK,
  SendbirdError,
  SendbirdFileMessage,
  SendbirdFileMessageCreateParams,
  SendbirdFileMessageUpdateParams,
  SendbirdGroupChannel,
  SendbirdGroupChannelCollection,
  SendbirdGroupChannelListQuery,
  SendbirdMessage,
  SendbirdMessageCollection,
  SendbirdOpenChannel,
  SendbirdOpenChannelListQuery,
  SendbirdPreviousMessageListQuery,
  SendbirdUserMessage,
  SendbirdUserMessageCreateParams,
  SendbirdUserMessageUpdateParams,
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
 * @deprecated This hook is deprecated and will be replaced by the '@sendbird/uikit-tools' package.
 *
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
 * @deprecated This hook is deprecated and will be replaced by the '@sendbird/uikit-tools' package.
 *
 * @interface UseGroupChannelMessages
 * @description interface for group channel messages hook
 * - Receive new messages from other users & should count new messages -> append to state(newMessages)
 * - onTopReached -> prev() -> fetch prev messages and append to state(messages)
 * - onBottomReached -> next() -> fetch next messages and append to state(messages)
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
     * Check if there are more prev messages to fetch
     * @return {boolean}
     * */
    hasPrev: () => boolean;

    /**
     * Fetch next messages to state
     * @return {Promise<void>}
     * */
    next: () => Promise<void>;

    /**
     * Check if there are more next messages to fetch
     * @return {boolean}
     * */
    hasNext: () => boolean;

    /**
     * A new message means a message that meets the below conditions
     * - Not admin message
     * - Not updated message
     * - Not current user's message
     * */
    newMessages: SendbirdMessage[];

    /**
     * reset message list with starting point
     * */
    resetWithStartingPoint: (startingPoint: number, callback?: () => void) => void;

    /**
     * Reset new messages
     * */
    resetNewMessages: () => void;

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
    updateFileMessage: (messageId: number, params: SendbirdFileMessageUpdateParams) => Promise<SendbirdFileMessage>;

    /**
     * Update user message
     * @param messageId
     * @param params user message params
     * @return updated message
     * */
    updateUserMessage: (messageId: number, params: SendbirdUserMessageUpdateParams) => Promise<SendbirdUserMessage>;

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
  replyType?: ReplyType;
  sortComparator?: (a: SendbirdMessage, b: SendbirdMessage) => number;
  queryCreator?: () => SendbirdPreviousMessageListQuery;
  collectionCreator?: (options?: Pick<UseGroupChannelMessagesOptions, 'startingPoint'>) => SendbirdMessageCollection;
  enableCollectionWithoutLocalCache?: boolean;
  onChannelDeleted?: () => void;
  shouldCountNewMessages?: () => boolean;
  startingPoint?: number;
  onMessagesReceived?: (messages: SendbirdMessage[]) => void;
  onMessagesUpdated?: (messages: SendbirdMessage[]) => void;
};

/**
 * @interface UseOpenChannelList
 * @description interface for open channel list hook
 * */
export interface UseOpenChannelList {
  (sdk: SendbirdChatSDK, userId?: string, options?: UseOpenChannelListOptions): {
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
     * Error state
     * */
    error: unknown | null;

    /**
     * Get open channels state
     * */
    openChannels: SendbirdOpenChannel[];

    /**
     * Fetch next channels to state
     * @return {Promise<void>}
     * */
    next: () => Promise<void>;
  };
}
export type UseOpenChannelListOptions = {
  queryCreator?: () => SendbirdOpenChannelListQuery;
};

/**
 * @interface UseOpenChannelMessages
 * @description interface for open channel messages hook
 * - Receive new messages from other users & should count new messages -> append to state(newMessages)
 * - onTopReached -> prev() -> fetch prev messages and append to state(messages)
 * - onBottomReached -> noop
 * */
export interface UseOpenChannelMessages {
  (sdk: SendbirdChatSDK, channel: SendbirdOpenChannel, userId?: string, options?: UseOpenChannelMessagesOptions): {
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
     * Check if there are more prev messages to fetch
     * @return {boolean}
     * */
    hasPrev: () => boolean;

    /**
     * A new message means a message that meets the below conditions
     * - Not admin message
     * - Not updated message
     * - Not current user's message
     * */
    newMessages: SendbirdMessage[];

    /**
     * Reset new messages
     * */
    resetNewMessages: () => void;

    /**
     * Fetch next messages to state
     * @return {Promise<void>}
     * */
    next: () => Promise<void>;

    /**
     * Check if there are more next messages to fetch
     * @return {boolean}
     * */
    hasNext: () => boolean;

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
    updateFileMessage: (messageId: number, params: SendbirdFileMessageUpdateParams) => Promise<SendbirdFileMessage>;

    /**
     * Update user message
     * @param messageId
     * @param params user message params
     * @return updated message
     * */
    updateUserMessage: (messageId: number, params: SendbirdUserMessageUpdateParams) => Promise<SendbirdUserMessage>;

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

export type UseOpenChannelMessagesOptions = {
  sortComparator?: (a: SendbirdMessage, b: SendbirdMessage) => number;
  queryCreator?: () => SendbirdPreviousMessageListQuery;
  onChannelDeleted?: () => void;
  onError?: (error?: unknown) => void;
  shouldCountNewMessages?: () => boolean;
  onMessagesReceived?: (messages: SendbirdMessage[]) => void;
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
