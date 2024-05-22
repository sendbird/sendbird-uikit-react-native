import { useEffect, useLayoutEffect, useRef } from 'react';

import { CollectionEventSource, type SendbirdChatWith } from '@sendbird/chat';
import type {
  GroupChannel,
  GroupChannelModule,
  MessageCollection,
  MessageCollectionParams,
} from '@sendbird/chat/groupChannel';
import { MessageCollectionInitPolicy, MessageFilter } from '@sendbird/chat/groupChannel';
import {
  BaseMessage,
  FileMessage,
  FileMessageCreateParams,
  FileMessageUpdateParams,
  MessageRequestHandler,
  MultipleFilesMessage,
  MultipleFilesMessageCreateParams,
  MultipleFilesMessageRequestHandler,
  UserMessage,
  UserMessageCreateParams,
  UserMessageUpdateParams,
} from '@sendbird/chat/message';

import { ReplyType } from '@sendbird/chat/message';

import { sbuConstants } from '@sendbird/uikit-tools/src';
import type { SendbirdMessage } from '@sendbird/uikit-tools/src/types';
import { isDifferentChannel } from '@sendbird/uikit-tools/src/utils/channel';
import { isMyMessage, isSendableMessage } from '@sendbird/uikit-tools/src/utils/message';
import { isNotEmptyArray } from '@sendbird/uikit-tools/src/utils/validators';
import { useForceUpdate } from '@sendbird/uikit-tools/src/hooks/useForceUpdate';
import { useGroupChannelHandler } from '@sendbird/uikit-tools/src/hooks/useGroupChannelHandler';
import { usePreservedCallback } from '@sendbird/uikit-tools/src/hooks/usePreservedCallback';
import { useChannelMessagesReducer } from '@sendbird/uikit-tools/src/hooks/useGroupChannelMessages/reducer';
import { ThreadedMessageListParams } from '@sendbird/chat/lib/__definition';

type Log = (...args: unknown[]) => void;
type CollectionCreatorBasicParams = Omit<MessageCollectionParams, 'filter'>;
type UseGroupChannelThreadMessagesOptions = {
  markAsRead?: (channels: GroupChannel[]) => void;
  shouldCountNewMessages?: () => boolean;
  collectionCreator?: (basicParams?: CollectionCreatorBasicParams) => MessageCollection;
  sortComparator?: (a: SendbirdMessage, b: SendbirdMessage) => number;
  isReactionEnabled?: boolean;
  startingPoint?: number;
  
  onMessagesReceived?: (messages: SendbirdMessage[]) => void;
  onMessagesUpdated?: (messages: SendbirdMessage[]) => void;
  onChannelDeleted?: (channelUrl: string) => void;
  onChannelUpdated?: (channel: GroupChannel) => void;
  onCurrentUserBanned?: () => void;
  
  logger?: { info?: Log; warn?: Log; error?: Log; log?: Log; debug?: Log };
};
const createMessageCollection = (
  channel: GroupChannel,
  startingPoint: number,
  limit: { prev: number; next: number },
  options: UseGroupChannelThreadMessagesOptions,
) => {
  const basicParams: CollectionCreatorBasicParams = {
    prevResultLimit: limit.prev,
    nextResultLimit: limit.next,
    startingPoint: startingPoint,
  };
  
  const passedCollection = options?.collectionCreator?.(basicParams);
  if (passedCollection) return passedCollection;
  
  return channel.createMessageCollection({
    ...basicParams,
    filter: new MessageFilter({ replyType: ReplyType.ALL, ...basicParams }),
  });
};

function isThreadedOrParentMessage(message: BaseMessage, parentMessage: BaseMessage) {
  return message.parentMessageId === parentMessage.messageId || message.messageId === parentMessage.messageId;
}

function getThreadMessageListParams(params?: Partial<ThreadedMessageListParams>): ThreadedMessageListParams {
  return {
    prevResultSize: sbuConstants.collection.message.defaultLimit.prev,
    nextResultSize: sbuConstants.collection.message.defaultLimit.next,
    includeMetaArray: true,
    ...params,
  };
}

/**
 * group channel thread messages hook
 * - Receive new messages from other users & should count new messages -> append to state(newMessages)
 * - onTopReached -> prev() -> fetch prev messages and append to state(messages)
 * - onBottomReached -> next() -> fetch next messages and append to state(messages)
 * */
export const useGroupChannelThreadMessages = (
  sdk: SendbirdChatWith<[GroupChannelModule]>,
  channel: GroupChannel,
  parentMessage: FileMessage | UserMessage,
  options: UseGroupChannelThreadMessagesOptions = {},
) => {
  const internalOptions = useRef(options); // to keep reference of options in event handler
  internalOptions.current = options;
  
  const channelRef = useRef(channel); // to keep reference of channel in event handler
  channelRef.current = channel;
  
  const parentMessageRef = useRef(parentMessage); // to keep reference of parent message in event handler
  parentMessageRef.current = parentMessage;
  
  const startingPoint = internalOptions.current?.startingPoint || Number.MAX_SAFE_INTEGER;
  const logger = internalOptions.current.logger;
  const isFetching = useRef({ prev: false, next: false });
  const forceUpdate = useForceUpdate();
  const collectionRef = useRef<{ initialized: boolean; apiInitialized: boolean; instance: MessageCollection | null }>({
    initialized: false,
    apiInitialized: false,
    instance: null,
  });
  
  const {
    initialized,
    loading,
    refreshing,
    messages,
    newMessages,
    updateMessages,
    updateNewMessages,
    deleteNewMessages,
    deleteMessages,
    updateInitialized,
    updateLoading,
    updateRefreshing,
  } = useChannelMessagesReducer(options?.sortComparator);
  
  const markAsReadBySource = usePreservedCallback((source?: CollectionEventSource) => {
    if (!channelRef.current || !channelRef.current.url) { return logger?.error?.('[useGroupChannelThreadMessages] channel is required'); }
    
    try {
      switch (source) {
        case CollectionEventSource.EVENT_MESSAGE_RECEIVED:
        case CollectionEventSource.EVENT_MESSAGE_SENT_SUCCESS:
        case CollectionEventSource.SYNC_MESSAGE_FILL:
        case undefined:
          internalOptions.current.markAsRead?.([channelRef.current]);
          break;
      }
    } catch (e) {
      logger?.warn?.('[useGroupChannelThreadMessages/markAsReadBySource]', e);
    }
  });
  
  const updateNewMessagesReceived = usePreservedCallback((source: CollectionEventSource, messages: BaseMessage[]) => {
    const incomingMessages = messages.filter(
      (it) => isThreadedOrParentMessage(it, parentMessageRef.current) && !isMyMessage(it, sdk.currentUser?.userId),
    );
    if (incomingMessages.length > 0) {
      switch (source) {
        case CollectionEventSource.EVENT_MESSAGE_RECEIVED:
        case CollectionEventSource.SYNC_MESSAGE_FILL: {
          if (internalOptions.current.shouldCountNewMessages?.()) {
            updateNewMessages(incomingMessages, false, sdk.currentUser?.userId);
          }
          internalOptions.current.onMessagesReceived?.(incomingMessages);
          break;
        }
      }
    }
  });
  
  const init = usePreservedCallback(async (startingPoint: number) => {
    return new Promise<void>((resolve) => {
      
      if (!channelRef.current || !channelRef.current.url) {
        return logger?.error?.('[useGroupChannelThreadMessages] channel is required');
      }
      
      if (!parentMessageRef.current) {
        return logger?.error?.('[useGroupChannelThreadMessages] parent message is required');
      }
      
      if (collectionRef.current.instance) collectionRef.current.instance.dispose();
      
      markAsReadBySource();
      updateNewMessages([], true, sdk.currentUser?.userId);
      
      const updateUnsentMessages = () => {
        const { pendingMessages, failedMessages } = collectionRef.current.instance ?? {};
        
        let filteredMessages;
        if (isNotEmptyArray(pendingMessages)) {
          filteredMessages = pendingMessages.filter((message) =>
            isThreadedOrParentMessage(message, parentMessageRef.current),
          );
        }
        
        if (isNotEmptyArray(failedMessages)) {
          filteredMessages = failedMessages.filter((message) =>
            isThreadedOrParentMessage(message, parentMessageRef.current),
          );
        }
        
        if (isNotEmptyArray(filteredMessages)) updateMessages(filteredMessages, false, sdk.currentUser?.userId);
      };
      
      setTimeout(async () => {
        try {
          const params = getThreadMessageListParams({ includeReactions: internalOptions.current.isReactionEnabled });
          
          const { threadedMessages } = await parentMessageRef.current.getThreadedMessagesByTimestamp(startingPoint, params);
          updateMessages(threadedMessages, true, sdk.currentUser?.userId);
          resolve();
        } catch (error) {
          logger?.error?.('[useGroupChannelThreadMessages] Initialize thread list failed.', error);
        }
      });
      
      const collectionInstance = createMessageCollection(
        channelRef.current,
        startingPoint,
        sbuConstants.collection.message.defaultLimit,
        {
          ...internalOptions.current,
        },
      );
      collectionRef.current = { apiInitialized: false, initialized: false, instance: collectionInstance };
      
      collectionInstance.setMessageCollectionHandler({
        onMessagesAdded: (ctx, __, messages) => {
          const filteredMessages = messages.filter((message) =>
            isThreadedOrParentMessage(message, parentMessageRef.current),
          );
          if (isNotEmptyArray(filteredMessages)) {
            markAsReadBySource(ctx.source);
            updateNewMessagesReceived(ctx.source, filteredMessages);
            updateMessages(filteredMessages, false, sdk.currentUser?.userId);
          }
        },
        onMessagesUpdated: (ctx, __, messages) => {
          const filteredMessages = messages.filter((message) =>
            isThreadedOrParentMessage(message, parentMessageRef.current),
          );
          if (isNotEmptyArray(filteredMessages)) {
            markAsReadBySource(ctx.source);
            updateNewMessagesReceived(ctx.source, filteredMessages); // NOTE: admin message is not added via onMessagesAdded handler, not checked yet is this a bug.
            
            updateMessages(filteredMessages, false, sdk.currentUser?.userId);
            
            if (ctx.source === CollectionEventSource.EVENT_MESSAGE_UPDATED) {
              internalOptions.current.onMessagesUpdated?.(filteredMessages);
            }
          }
        },
        onMessagesDeleted: (_, __, ___, messages) => {
          const filteredMessages = messages.filter((message) =>
            isThreadedOrParentMessage(message, parentMessageRef.current),
          );
          if (isNotEmptyArray(filteredMessages)) {
            const msgIds = filteredMessages.map((it) => it.messageId);
            const reqIds = filteredMessages.filter(isSendableMessage).map((it) => it.reqId);
            deleteMessages(msgIds, reqIds);
            deleteNewMessages(msgIds, reqIds);
          }
        },
        onChannelDeleted: (_, channelUrl) => {
          internalOptions.current.onChannelDeleted?.(channelUrl);
        },
        onChannelUpdated: (_, channel) => {
          forceUpdate();
          internalOptions.current.onChannelUpdated?.(channel);
        },
        onHugeGapDetected: () => {
          init(startingPoint);
        },
      });
      
      collectionInstance
        .initialize(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
        .onCacheResult((err, messages) => {
          if (err) {
            sdk.isCacheEnabled && logger?.error?.('[useGroupChannelThreadMessages/onCacheResult]', err);
          }
          else if (messages) {
            logger?.debug?.('[useGroupChannelThreadMessages/onCacheResult]', 'message length:', messages.length);
            
            const filteredMessages = messages.filter((message) =>
              isThreadedOrParentMessage(message, parentMessageRef.current),
            );
            if (isNotEmptyArray(filteredMessages)) {
              updateMessages(filteredMessages, false, sdk.currentUser?.userId);
              updateUnsentMessages();
            }
          }
        })
        .onApiResult((err, messages) => {
          if (err) {
            logger?.warn?.('[useGroupChannelThreadMessages/onApiResult]', err);
          }
          else if (messages) {
            logger?.debug?.('[useGroupChannelThreadMessages/onApiResult]', 'message length:', messages.length);
            
            const filteredMessages = messages.filter((message) =>
              isThreadedOrParentMessage(message, parentMessageRef.current),
            );
            if (isNotEmptyArray(filteredMessages)) {
              updateMessages(filteredMessages, false, sdk.currentUser?.userId);
              if (sdk.isCacheEnabled) updateUnsentMessages();
            }
          }
          
          collectionRef.current.initialized = true;
          collectionRef.current.apiInitialized = true;
        });
    });
  });
  
  useGroupChannelHandler(sdk, {
    onUserBanned(eventChannel, bannedUser) {
      if (eventChannel.isGroupChannel() && !isDifferentChannel(eventChannel, channelRef.current)) {
        if (bannedUser.userId === sdk.currentUser?.userId) {
          internalOptions.current.onCurrentUserBanned?.();
        } else {
          forceUpdate();
        }
      }
    },
  });
  
  useLayoutEffect(() => {
    const timeout = setTimeout(async () => {
      if (sdk.currentUser && channelRef.current) {
        updateInitialized(false);
        updateLoading(true);
        await init(startingPoint);
        updateLoading(false);
        updateInitialized(true);
      }
    });
    return () => clearTimeout(timeout);
  }, [sdk, sdk.currentUser?.userId, channelRef.current?.url]);
  
  useEffect(() => {
    return () => {
      if (collectionRef.current.instance) collectionRef.current.instance.dispose();
    };
  }, []);
  
  const refresh = usePreservedCallback(async () => {
    if (sdk.currentUser && channelRef.current) {
      updateRefreshing(true);
      await init(startingPoint);
      updateRefreshing(false);
    }
  });
  
  const loadPrevious = usePreservedCallback(async () => {
    const collection = collectionRef.current.instance;
    if (collection?.hasPrevious && !isFetching.current.prev) {
      try {
        isFetching.current.prev = true;
        const list = await collection.loadPrevious();
        updateMessages(list, false, sdk.currentUser?.userId);
      } catch {
        // noop
      } finally {
        isFetching.current.prev = false;
      }
    }
  });
  
  const hasPrevious = usePreservedCallback(() => {
    const { initialized, instance } = collectionRef.current;
    if (initialized && instance) {
      return instance.hasPrevious;
    } else {
      return false;
    }
  });
  
  const loadNext = usePreservedCallback(async () => {
    const collection = collectionRef.current.instance;
    if (collection?.hasNext && !isFetching.current.next) {
      try {
        isFetching.current.next = true;
        const list = await collection.loadNext();
        updateMessages(list, false, sdk.currentUser?.userId);
      } catch {
        // noop
      } finally {
        isFetching.current.next = false;
      }
    }
  });
  
  const hasNext = usePreservedCallback(() => {
    // When the API is not initialized, the default value of collection.hasNext is true.
    // Due to this, there is an issue with UI elements such as the scroll to bottom button appearing and disappearing.
    // To address this, we additionally check the API initialized state.
    const { initialized, apiInitialized, instance } = collectionRef.current;
    if (apiInitialized && initialized && instance) {
      return instance.hasNext;
    } else {
      return false;
    }
  });
  
  const sendUserMessage = usePreservedCallback(
    (params: UserMessageCreateParams, onPending: (message: UserMessage) => void): Promise<UserMessage> => {
      if (!channelRef.current || !channelRef.current.url) {
        logger?.error?.('[useGroupChannelThreadMessages] channel is required');
        throw new Error('Channel is required');
      }
      
      return new Promise((resolve, reject) => {
        channelRef.current
          .sendUserMessage(params)
          .onPending((pendingMessage) => {
            if (pendingMessage.channelUrl === channelRef.current.url) {
              updateMessages([pendingMessage], false, sdk.currentUser?.userId);
            }
            onPending?.(pendingMessage as UserMessage);
          })
          .onSucceeded((sentMessage) => {
            if (sentMessage.channelUrl === channelRef.current.url) {
              updateMessages([sentMessage], false, sdk.currentUser?.userId);
            }
            resolve(sentMessage as UserMessage);
          })
          .onFailed((err, failedMessage) => {
            if (failedMessage && failedMessage.channelUrl === channelRef.current.url) {
              updateMessages([failedMessage], false, sdk.currentUser?.userId);
            }
            reject(err);
          });
      });
    },
  );
  const sendFileMessage = usePreservedCallback(
    (params: FileMessageCreateParams, onPending?: (message: FileMessage) => void): Promise<FileMessage> => {
      if (!channelRef.current || !channelRef.current.url) {
        logger?.error?.('[useGroupChannelThreadMessages] channel is required');
        throw new Error('Channel is required');
      }
      
      return new Promise((resolve, reject) => {
        channelRef.current
          .sendFileMessage(params)
          .onPending((pendingMessage) => {
            if (pendingMessage.channelUrl === channelRef.current.url) {
              updateMessages([pendingMessage], false, sdk.currentUser?.userId);
            }
            onPending?.(pendingMessage as FileMessage);
          })
          .onSucceeded((sentMessage) => {
            if (sentMessage.channelUrl === channelRef.current.url) {
              updateMessages([sentMessage], false, sdk.currentUser?.userId);
            }
            resolve(sentMessage as FileMessage);
          })
          .onFailed((err, failedMessage) => {
            if (failedMessage && failedMessage.channelUrl === channelRef.current.url) {
              updateMessages([failedMessage], false, sdk.currentUser?.userId);
            }
            reject(err);
          });
      });
    },
  );
  const sendFileMessages = usePreservedCallback(
    async (
      paramsList: FileMessageCreateParams[],
      onPending?: (message: FileMessage) => void,
    ): Promise<FileMessage[]> => {
      if (!channelRef.current || !channelRef.current.url) {
        logger?.error?.('[useGroupChannelThreadMessages] channel is required');
        throw new Error('Channel is required');
      }
      
      return new Promise((resolve) => {
        const messages: FileMessage[] = [];
        
        channelRef.current
          .sendFileMessages(paramsList)
          .onPending((pendingMessage) => {
            if (pendingMessage.channelUrl === channelRef.current.url) {
              updateMessages([pendingMessage], false, sdk.currentUser?.userId);
            }
            onPending?.(pendingMessage as FileMessage);
          })
          .onSucceeded((sentMessage) => {
            if (sentMessage.isFileMessage() && sentMessage.channelUrl === channelRef.current.url) {
              updateMessages([sentMessage], false, sdk.currentUser?.userId);
              messages.push(sentMessage);
            }
            
            if (messages.length === paramsList.length) resolve(messages);
          })
          .onFailed((_, failedMessage) => {
            if (failedMessage && failedMessage.channelUrl === channelRef.current.url) {
              updateMessages([failedMessage], false, sdk.currentUser?.userId);
              messages.push(failedMessage as FileMessage);
            } else {
              // NOTE: Since failedMessage is nullable by type, to resolve the promise, handle pushing null even when there is no failedMessage.
              messages.push(null as unknown as FileMessage);
            }
            
            if (messages.length === paramsList.length) resolve(messages);
          });
      });
    },
  );
  const sendMultipleFilesMessage = usePreservedCallback(
    (
      params: MultipleFilesMessageCreateParams,
      onPending?: (message: MultipleFilesMessage) => void,
    ): Promise<MultipleFilesMessage> => {
      if (!channelRef.current || !channelRef.current.url) {
        logger?.error?.('[useGroupChannelThreadMessages] channel is required');
        throw new Error('Channel is required');
      }
      
      return new Promise((resolve, reject) => {
        channelRef.current
          .sendMultipleFilesMessage(params)
          .onPending((pendingMessage) => {
            if (pendingMessage.channelUrl === channelRef.current.url) {
              updateMessages([pendingMessage], false, sdk.currentUser?.userId);
            }
            onPending?.(pendingMessage as MultipleFilesMessage);
          })
          .onFileUploaded(() => {
            // Just re-render to use updated message.messageParams
            forceUpdate();
          })
          .onSucceeded((sentMessage) => {
            if (sentMessage.channelUrl === channelRef.current.url) {
              updateMessages([sentMessage], false, sdk.currentUser?.userId);
            }
            resolve(sentMessage as MultipleFilesMessage);
          })
          .onFailed((err, failedMessage) => {
            if (failedMessage && failedMessage.channelUrl === channelRef.current.url) {
              updateMessages([failedMessage], false, sdk.currentUser?.userId);
            }
            reject(err);
          });
      });
    },
  );
  
  const updateUserMessage = usePreservedCallback(
    async (messageId: number, params: UserMessageUpdateParams): Promise<UserMessage> => {
      if (!channelRef.current || !channelRef.current.url) {
        logger?.error?.('[useGroupChannelThreadMessages] channel is required');
        throw new Error('Channel is required');
      }
      
      const updatedMessage = await channelRef.current.updateUserMessage(messageId, params);
      if (updatedMessage.channelUrl === channelRef.current.url) {
        updateMessages([updatedMessage], false, sdk.currentUser?.userId);
      }
      return updatedMessage;
    },
  );
  const updateFileMessage = usePreservedCallback(
    async (messageId: number, params: FileMessageUpdateParams): Promise<FileMessage> => {
      if (!channelRef.current || !channelRef.current.url) {
        logger?.error?.('[useGroupChannelThreadMessages] channel is required');
        throw new Error('Channel is required');
      }
      
      const updatedMessage = await channelRef.current.updateFileMessage(messageId, params);
      if (updatedMessage.channelUrl === channelRef.current.url) {
        updateMessages([updatedMessage], false, sdk.currentUser?.userId);
      }
      return updatedMessage;
    },
  );
  
  const resendMessage = usePreservedCallback(
    async <T extends UserMessage | FileMessage | MultipleFilesMessage>(failedMessage: T): Promise<T> => {
      if (!channelRef.current || !channelRef.current.url) {
        logger?.error?.('[useGroupChannelThreadMessages] channel is required');
        throw new Error('Channel is required');
      }
      
      return new Promise<T>((resolve, reject) => {
        let handler:
          | MessageRequestHandler<UserMessage>
          | MessageRequestHandler<FileMessage>
          | MultipleFilesMessageRequestHandler<MultipleFilesMessage>
          | undefined = undefined;
        
        if (failedMessage.isUserMessage()) handler = channelRef.current.resendMessage(failedMessage);
        if (failedMessage.isFileMessage()) handler = channelRef.current.resendMessage(failedMessage);
        if (failedMessage.isMultipleFilesMessage()) handler = channelRef.current.resendMessage(failedMessage);
        
        if (handler) {
          if ('onPending' in handler) {
            handler.onPending((message) => {
              if (message.channelUrl === channelRef.current.url) {
                updateMessages([message], false, sdk.currentUser?.userId);
              }
            });
          }
          
          if ('onFileUploaded' in handler) {
            handler.onFileUploaded(() => {
              // Just re-render to use updated message.messageParams
              forceUpdate();
            });
          }
          
          if ('onSucceeded' in handler) {
            handler.onSucceeded((message) => {
              if (message.channelUrl === channelRef.current.url) {
                updateMessages([message], false, sdk.currentUser?.userId);
              }
              resolve(message as T);
            });
          }
          
          if ('onFailed' in handler) {
            handler.onFailed((err, message) => {
              if (message && message.channelUrl === channelRef.current.url) {
                updateMessages([message], false, sdk.currentUser?.userId);
              }
              reject(err);
            });
          }
        }
      });
    },
  );
  
  const deleteMessage = usePreservedCallback(
    async <T extends UserMessage | FileMessage | MultipleFilesMessage>(message: T): Promise<void> => {
      if (!channelRef.current || !channelRef.current.url) {
        logger?.error?.('[useGroupChannelThreadMessages] channel is required');
        throw new Error('Channel is required');
      }
      
      if (message.sendingStatus === 'succeeded') {
        if (message.isUserMessage()) await channelRef.current.deleteMessage(message);
        if (message.isFileMessage()) await channelRef.current.deleteMessage(message);
        if (message.isMultipleFilesMessage()) await channelRef.current.deleteMessage(message);
      } else {
        try {
          await collectionRef.current.instance?.removeFailedMessage(message.reqId);
        } finally {
          deleteMessages([message.messageId], [message.reqId]);
        }
      }
    },
  );
  const resetNewMessages = usePreservedCallback(() => {
    updateNewMessages([], true, sdk.currentUser?.userId);
  });
  const resetWithStartingPoint = usePreservedCallback(async (startingPoint: number) => {
    if (sdk.currentUser && channelRef.current) {
      updateLoading(true);
      updateMessages([], true, sdk.currentUser?.userId);
      await init(startingPoint);
      updateLoading(false);
    }
  });
  
  return {
    /**
     * Initialized state, only available on first render
     * */
    initialized,
    
    /**
     * Loading state, status is changes on first mount or when the resetWithStartingPoint is called.
     * */
    loading,
    
    /**
     * Refreshing state, status is changes when the refresh is called.
     * */
    refreshing,
    
    /**
     * Get messages, this state is for render
     * For example, if a user receives a new messages while searching for an old message
     * for this case, new messages will be included here.
     * */
    messages,
    
    /**
     * If the `shouldCountNewMessages()` is true, only then push in the newMessages state.
     * (Return false for the `shouldCountNewMessages()` if the message scroll is the most recent; otherwise, return true.)
     *
     * A new message means a message that meets the below conditions
     * - Not admin message
     * - Not updated message
     * - Not current user's message
     * */
    newMessages,
    
    /**
     * Reset new message list
     * @return {void}
     * */
    resetNewMessages,
    
    /**
     * Reset message list and create a new collection for latest messages
     * @return {Promise<void>}
     * */
    refresh,
    
    /**
     * Load previous messages to state
     * @return {Promise<void>}
     * */
    loadPrevious,
    
    /**
     * Check if there are more previous messages to fetch
     * @return {boolean}
     * */
    hasPrevious,
    
    /**
     * Load next messages to state
     * @return {Promise<void>}
     * */
    loadNext,
    
    /**
     * Check if there are more next messages to fetch
     * @return {boolean}
     * */
    hasNext,
    
    /**
     * Send user message
     * @param {UserMessageCreateParams} params user message create params
     * @param {function} [onPending] pending message callback
     * @return {Promise<UserMessage>} succeeded message
     * */
    sendUserMessage,
    
    /**
     * Send file message
     * @param {FileMessageCreateParams} params file message create params
     * @param {function} [onPending] pending message callback
     * @return {Promise<FileMessage>} succeeded message
     * */
    sendFileMessage,
    
    /**
     * Send file messages
     * @param {FileMessageCreateParams[]} paramList file message create params
     * @param {function} [onPending] pending message callback for each message request
     * @return {Promise<FileMessage[]>} succeeded or failed message
     * */
    sendFileMessages,
    
    /**
     * Send multiple files message
     * @param {MultipleFilesMessageCreateParams} params multiple files message create params
     * @param {function} [onPending] pending message callback
     * @return {Promise<MultipleFilesMessage>} succeeded message
     * */
    sendMultipleFilesMessage,
    
    /**
     * Update user message
     * @param {number} messageId
     * @param {UserMessageUpdateParams} params user message update params
     * @return {Promise<UserMessage>}
     * */
    updateUserMessage,
    
    /**
     * Update file message
     * @param {number} messageId
     * @param {FileMessageUpdateParams} params file message update params
     * @return {Promise<FileMessage>}
     * */
    updateFileMessage,
    
    /**
     * Resend failed message
     * @template {UserMessage | FileMessage | MultipleFilesMessage} T
     * @param {T} failedMessage message to resend
     * @return {Promise<T>}
     * */
    resendMessage,
    
    /**
     * Delete a message
     * @template {UserMessage | FileMessage | MultipleFilesMessage} T
     * @param {T} message succeeded or failed message
     * @return {Promise<void>}
     * */
    deleteMessage,
    
    /**
     * Reset message list and create a new collection with starting point
     * @param {number} startingPoint
     * @param {function} callback
     * @return {void}
     * */
    resetWithStartingPoint,
  };
};
