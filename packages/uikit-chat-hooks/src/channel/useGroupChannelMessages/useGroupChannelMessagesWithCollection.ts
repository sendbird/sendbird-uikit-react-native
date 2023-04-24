import { useEffect, useRef } from 'react';

import { MessageCollectionInitPolicy, MessageEventSource, MessageFilter } from '@sendbird/chat/groupChannel';
import type { SendbirdFileMessage, SendbirdGroupChannel, SendbirdMessageCollection } from '@sendbird/uikit-utils';
import {
  Logger,
  confirmAndMarkAsRead,
  isDifferentChannel,
  isMyMessage,
  useForceUpdate,
  useFreshCallback,
  useUniqHandlerId,
} from '@sendbird/uikit-utils';

import { useChannelHandler } from '../../handler/useChannelHandler';
import type { UseGroupChannelMessages, UseGroupChannelMessagesOptions } from '../../types';
import { useChannelMessagesReducer } from '../useChannelMessagesReducer';

const createMessageCollection = (channel: SendbirdGroupChannel, options?: UseGroupChannelMessagesOptions) => {
  if (options?.collectionCreator) return options?.collectionCreator({ startingPoint: options?.startingPoint });
  const filter = new MessageFilter();
  return channel.createMessageCollection({ filter, limit: 100, startingPoint: options?.startingPoint });
};

function isNotEmpty(arr?: unknown[]): arr is unknown[] {
  if (!arr) return false;
  return arr.length !== 0;
}

export const useGroupChannelMessagesWithCollection: UseGroupChannelMessages = (sdk, channel, userId, options) => {
  const forceUpdate = useForceUpdate();
  const collectionRef = useRef<SendbirdMessageCollection>();
  const handlerId = useUniqHandlerId('useGroupChannelMessagesWithCollection');

  const {
    loading,
    refreshing,
    messages,
    newMessages,
    updateMessages,
    updateNewMessages,
    deleteNewMessages,
    deleteMessages,
    updateLoading,
    updateRefreshing,
  } = useChannelMessagesReducer(options?.sortComparator);

  const channelMarkAsRead = async (source?: MessageEventSource) => {
    try {
      switch (source) {
        case MessageEventSource.EVENT_MESSAGE_RECEIVED:
        case MessageEventSource.EVENT_MESSAGE_SENT_SUCCESS:
        case MessageEventSource.SYNC_MESSAGE_FILL:
        case undefined:
          await confirmAndMarkAsRead([channel]);
          break;
      }
    } catch (e) {
      Logger.warn('[useGroupChannelMessagesWithCollection/channelMarkAsRead]', e);
    }
  };

  const updateUnsendMessages = () => {
    const { pendingMessages, failedMessages } = collectionRef.current ?? {};
    if (isNotEmpty(pendingMessages)) updateMessages(pendingMessages, false, sdk.currentUser.userId);
    if (isNotEmpty(failedMessages)) updateMessages(failedMessages, false, sdk.currentUser.userId);
  };

  const init = useFreshCallback(async (uid?: string, callback?: () => void) => {
    if (collectionRef.current) collectionRef.current?.dispose();

    if (uid) {
      channelMarkAsRead();
      updateNewMessages([], true, sdk.currentUser.userId);

      collectionRef.current = createMessageCollection(channel, options);
      collectionRef.current?.setMessageCollectionHandler({
        onMessagesAdded: (_, __, messages) => {
          channelMarkAsRead(_.source);

          const incomingMessages = messages.filter((it) => !isMyMessage(it, sdk.currentUser.userId));
          if (incomingMessages.length > 0) {
            updateMessages(incomingMessages, false, sdk.currentUser.userId);

            if (options?.shouldCountNewMessages?.()) {
              updateNewMessages(incomingMessages, false, sdk.currentUser.userId);
            }
          }
        },
        onMessagesUpdated: (_, __, messages) => {
          channelMarkAsRead(_.source);

          const incomingMessages = messages.filter((it) => !isMyMessage(it, sdk.currentUser.userId));
          if (incomingMessages.length > 0) {
            // NOTE: admin message is not added via onMessagesAdded handler, not checked yet is this a bug.
            updateMessages(messages, false, sdk.currentUser.userId);

            if (options?.shouldCountNewMessages?.()) {
              if (_.source === MessageEventSource.EVENT_MESSAGE_RECEIVED) {
                updateNewMessages(messages, false, sdk.currentUser.userId);
              }
            }
          }
        },
        onMessagesDeleted: (_, __, messageIds) => {
          deleteMessages(messageIds, []);
          deleteNewMessages(messageIds, []);
        },
        onChannelDeleted: () => {
          options?.onChannelDeleted?.();
        },
        onChannelUpdated: (_, eventChannel) => {
          if (eventChannel.isGroupChannel() && !isDifferentChannel(eventChannel, channel)) {
            forceUpdate();
          }
        },
        onHugeGapDetected: () => {
          init(uid);
        },
      });

      collectionRef.current
        .initialize(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
        .onCacheResult((err, messages) => {
          if (err) sdk.isCacheEnabled && Logger.error('[useGroupChannelMessagesWithCollection/onCacheResult]', err);
          else {
            Logger.debug('[useGroupChannelMessagesWithCollection/onCacheResult]', 'message length:', messages.length);

            updateMessages(messages, true, sdk.currentUser.userId);
            updateUnsendMessages();
          }
          callback?.();
        })
        .onApiResult((err, messages) => {
          if (err) Logger.warn('[useGroupChannelMessagesWithCollection/onApiResult]', err);
          else {
            Logger.debug('[useGroupChannelMessagesWithCollection/onApiResult]', 'message length:', messages.length);

            updateMessages(messages, true, sdk.currentUser.userId);
            if (sdk.isCacheEnabled) updateUnsendMessages();
          }
          callback?.();
        });
    }
  });

  useChannelHandler(sdk, handlerId, {
    onUserBanned(channel, bannedUser) {
      if (channel.isGroupChannel() && !isDifferentChannel(channel, channel)) {
        if (bannedUser.userId === sdk.currentUser.userId) {
          options?.onChannelDeleted?.();
        } else {
          forceUpdate();
        }
      }
    },
  });

  useEffect(() => {
    // NOTE: Cache read is heavy task, and it prevents smooth ui transition
    setTimeout(async () => {
      updateLoading(true);
      init(userId, () => updateLoading(false));
    }, 0);
  }, [channel.url, userId]);

  useEffect(() => {
    return () => {
      if (collectionRef.current) collectionRef.current?.dispose();
    };
  }, []);

  const refresh: ReturnType<UseGroupChannelMessages>['refresh'] = useFreshCallback(async () => {
    updateRefreshing(true);
    init(userId, () => updateRefreshing(false));
  });

  const prev: ReturnType<UseGroupChannelMessages>['prev'] = useFreshCallback(async () => {
    console.log('call next', collectionRef.current?.hasNext);
    if (collectionRef.current && collectionRef.current?.hasPrevious) {
      try {
        const list = await collectionRef.current?.loadPrevious();
        updateMessages(list, false, sdk.currentUser.userId);
      } catch {}
    }
  });

  const hasPrev: ReturnType<UseGroupChannelMessages>['hasPrev'] = useFreshCallback(
    () => collectionRef.current?.hasPrevious ?? false,
  );

  const next: ReturnType<UseGroupChannelMessages>['next'] = useFreshCallback(async () => {
    console.log('call next', collectionRef.current?.hasNext);
    if (collectionRef.current && collectionRef.current?.hasNext) {
      try {
        const fetchedList = await collectionRef.current?.loadNext();
        updateMessages(fetchedList, false, sdk.currentUser.userId);
      } catch {}
    }
  });

  const hasNext: ReturnType<UseGroupChannelMessages>['hasNext'] = useFreshCallback(
    () => collectionRef.current?.hasNext ?? false,
  );

  const sendUserMessage: ReturnType<UseGroupChannelMessages>['sendUserMessage'] = useFreshCallback(
    (params, onPending) => {
      return new Promise((resolve, reject) => {
        channel
          .sendUserMessage(params)
          .onPending((pendingMessage) => {
            if (pendingMessage.isUserMessage()) {
              onPending?.(pendingMessage);
              updateMessages([pendingMessage], false, sdk.currentUser.userId);
            }
          })
          .onSucceeded((sentMessage) => {
            if (sentMessage.isUserMessage()) {
              updateMessages([sentMessage], false, sdk.currentUser.userId);
              resolve(sentMessage);
            }
          })
          .onFailed((err, _failedMessage) => {
            // updateMessages([failedMessage], false, sdk.currentUser.userId);
            reject(err);
          });
      });
    },
  );
  const sendFileMessage: ReturnType<UseGroupChannelMessages>['sendFileMessage'] = useFreshCallback(
    (params, onPending) => {
      return new Promise((resolve, reject) => {
        channel
          .sendFileMessage(params)
          .onPending((pendingMessage) => {
            if (pendingMessage.isFileMessage()) {
              updateMessages([pendingMessage], false, sdk.currentUser.userId);
              onPending?.(pendingMessage);
            }
          })
          .onSucceeded((sentMessage) => {
            if (sentMessage.isFileMessage()) {
              updateMessages([sentMessage], false, sdk.currentUser.userId);
              resolve(sentMessage as SendbirdFileMessage);
            }
          })
          .onFailed((err, _failedMessage) => {
            // updateMessages([failedMessage], false, sdk.currentUser.userId);
            reject(err);
          });
      });
    },
  );
  const updateUserMessage: ReturnType<UseGroupChannelMessages>['updateUserMessage'] = useFreshCallback(
    async (messageId, params) => {
      const updatedMessage = await channel.updateUserMessage(messageId, params);
      updateMessages([updatedMessage], false, sdk.currentUser.userId);
      return updatedMessage;
    },
  );
  const updateFileMessage: ReturnType<UseGroupChannelMessages>['updateFileMessage'] = useFreshCallback(
    async (messageId, params) => {
      const updatedMessage = await channel.updateFileMessage(messageId, params);
      updateMessages([updatedMessage], false, sdk.currentUser.userId);
      return updatedMessage;
    },
  );
  const resendMessage: ReturnType<UseGroupChannelMessages>['resendMessage'] = useFreshCallback(
    async (failedMessage) => {
      const resentMessage = await (() => {
        if (failedMessage.isUserMessage()) return channel.resendUserMessage(failedMessage);
        if (failedMessage.isFileMessage()) return channel.resendFileMessage(failedMessage);
        return null;
      })();

      if (resentMessage) updateMessages([resentMessage], false, sdk.currentUser.userId);
    },
  );
  const deleteMessage: ReturnType<UseGroupChannelMessages>['deleteMessage'] = useFreshCallback(async (message) => {
    if (message.sendingStatus === 'succeeded') {
      if (message.isUserMessage()) await channel.deleteMessage(message);
      if (message.isFileMessage()) await channel.deleteMessage(message);
    } else {
      try {
        await collectionRef.current?.removeFailedMessage(message.reqId);
      } finally {
        deleteMessages([message.messageId], [message.reqId]);
      }
    }
  });
  const resetNewMessages: ReturnType<UseGroupChannelMessages>['resetNewMessages'] = useFreshCallback(() => {
    updateNewMessages([], true, sdk.currentUser.userId);
  });

  return {
    loading,
    refreshing,
    refresh,
    messages,
    next,
    hasNext,
    prev,
    hasPrev,
    newMessages,
    resetNewMessages,
    sendUserMessage,
    sendFileMessage,
    updateUserMessage,
    updateFileMessage,
    resendMessage,
    deleteMessage,
    nextMessages: newMessages,
    newMessagesFromMembers: newMessages,
  };
};
