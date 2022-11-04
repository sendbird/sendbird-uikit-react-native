import { useCallback, useEffect, useRef } from 'react';

import { MessageCollectionInitPolicy, MessageEventSource, MessageFilter } from '@sendbird/chat/groupChannel';
import type {
  SendbirdChannel,
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdMessageCollection,
} from '@sendbird/uikit-utils';
import { Logger, confirmAndMarkAsRead, isDifferentChannel, useForceUpdate } from '@sendbird/uikit-utils';

import { useChannelHandler } from '../../handler/useChannelHandler';
import type { UseGroupChannelMessages, UseGroupChannelMessagesOptions } from '../../types';
import { useGroupChannelMessagesReducer } from './reducer';

const createMessageCollection = (
  channel: SendbirdGroupChannel,
  creator?: UseGroupChannelMessagesOptions['collectionCreator'],
) => {
  if (creator) return creator();
  const filter = new MessageFilter();
  return channel.createMessageCollection({ filter, limit: 100 });
};

const HOOK_NAME = 'useGroupChannelMessagesWithCollection';

export const useGroupChannelMessagesWithCollection: UseGroupChannelMessages = (sdk, channel, userId, options) => {
  const forceUpdate = useForceUpdate();
  const collectionRef = useRef<SendbirdMessageCollection>();

  const {
    loading,
    refreshing,
    messages,
    nextMessages,
    newMessagesFromMembers,
    updateMessages,
    updateNextMessages,
    deleteNextMessages,
    deleteMessages,
    updateLoading,
    updateRefreshing,
  } = useGroupChannelMessagesReducer(userId, options?.sortComparator);

  const channelMarkAs = async () => {
    try {
      await confirmAndMarkAsRead([channel]);
    } catch (e) {
      Logger.warn(`[${HOOK_NAME}/channelMarkAs/Read]`, e);
    }
  };

  const updateChannel = (channel: SendbirdChannel) => {
    if (channel.isGroupChannel() && !isDifferentChannel(channel, channel)) {
      forceUpdate();
    }
  };

  const init = useCallback(
    async (uid?: string, callback?: () => void) => {
      if (collectionRef.current) collectionRef.current?.dispose();

      if (uid) {
        collectionRef.current = createMessageCollection(channel, options?.collectionCreator);
        updateNextMessages([], true, sdk.currentUser.userId);
        channelMarkAs();

        collectionRef.current?.setMessageCollectionHandler({
          onMessagesAdded: (_, __, messages) => {
            switch (_.source) {
              case MessageEventSource.EVENT_MESSAGE_RECEIVED:
              case MessageEventSource.EVENT_MESSAGE_SENT_SUCCESS:
              case MessageEventSource.SYNC_MESSAGE_FILL:
                channelMarkAs();
                break;
            }
            updateNextMessages(messages, false, sdk.currentUser.userId);
            updateChannel(channel);
          },
          onMessagesUpdated: (_, channel, messages) => {
            updateMessages(messages, false, sdk.currentUser.userId);
            updateChannel(channel);
          },
          onMessagesDeleted: (_, channel, messageIds) => {
            deleteMessages(messageIds, []);
            deleteNextMessages(messageIds, []);
            updateChannel(channel);
          },
          onChannelDeleted: () => {
            options?.onChannelDeleted?.();
          },
          onChannelUpdated: (_, channel) => {
            updateChannel(channel);
          },
          onHugeGapDetected: () => {
            init(uid);
          },
        });

        collectionRef.current
          .initialize(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
          .onCacheResult((err, messages) => {
            if (err) sdk.isCacheEnabled && Logger.error(`[${HOOK_NAME}/onCacheResult]`, err);
            else {
              Logger.debug(`[${HOOK_NAME}/onCacheResult]`, 'message length:', messages.length);
              updateMessages(messages, true, sdk.currentUser.userId);
              updateMessages(collectionRef.current?.pendingMessages ?? [], false, sdk.currentUser.userId);
              updateMessages(collectionRef.current?.failedMessages ?? [], false, sdk.currentUser.userId);
            }
            callback?.();
          })
          .onApiResult((err, messages) => {
            if (err) Logger.warn(`[${HOOK_NAME}/onApiResult]`, err);
            else {
              Logger.debug(`[${HOOK_NAME}/onApiResult]`, 'message length:', messages.length);
              updateMessages(messages, true, sdk.currentUser.userId);
              if (sdk.isCacheEnabled) {
                updateMessages(collectionRef.current?.pendingMessages ?? [], false, sdk.currentUser.userId);
                updateMessages(collectionRef.current?.failedMessages ?? [], false, sdk.currentUser.userId);
              }
            }
            callback?.();
          });
      }
    },
    [sdk, channel.url, options?.collectionCreator],
  );

  useChannelHandler(sdk, HOOK_NAME, {
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
  }, [init, userId]);

  useEffect(() => {
    return () => {
      if (collectionRef.current) collectionRef.current?.dispose();
    };
  }, []);

  const refresh: ReturnType<UseGroupChannelMessages>['refresh'] = useCallback(async () => {
    updateRefreshing(true);
    init(userId, () => updateRefreshing(false));
  }, [init, userId]);

  const prev: ReturnType<UseGroupChannelMessages>['prev'] = useCallback(async () => {
    if (collectionRef.current && collectionRef.current?.hasPrevious) {
      try {
        const list = await collectionRef.current?.loadPrevious();
        updateMessages(list, false, sdk.currentUser.userId);
      } catch {}
    }
  }, []);

  const next: ReturnType<UseGroupChannelMessages>['next'] = useCallback(async () => {
    const list = [];
    if (collectionRef.current && collectionRef.current?.hasNext) {
      try {
        const fetchedList = await collectionRef.current?.loadNext();
        list.push(...fetchedList);
      } catch {}
    }
    if (nextMessages.length > 0) {
      list.push(...nextMessages);
    }
    if (list.length > 0) {
      updateMessages(list, false, sdk.currentUser.userId);
      updateNextMessages([], true, sdk.currentUser.userId);
    }
  }, [nextMessages.length]);

  const sendUserMessage: ReturnType<UseGroupChannelMessages>['sendUserMessage'] = useCallback(
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
          .onFailed((err) => {
            reject(err);
          });
      });
    },
    [channel],
  );
  const sendFileMessage: ReturnType<UseGroupChannelMessages>['sendFileMessage'] = useCallback(
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
          .onFailed((err) => {
            reject(err);
          });
      });
    },
    [channel],
  );
  const updateUserMessage: ReturnType<UseGroupChannelMessages>['updateUserMessage'] = useCallback(
    async (messageId, params) => {
      const updatedMessage = await channel.updateUserMessage(messageId, params);
      updateMessages([updatedMessage], false, sdk.currentUser.userId);
      return updatedMessage;
    },
    [channel],
  );
  const updateFileMessage: ReturnType<UseGroupChannelMessages>['updateFileMessage'] = useCallback(
    async (messageId, params) => {
      const updatedMessage = await channel.updateFileMessage(messageId, params);
      updateMessages([updatedMessage], false, sdk.currentUser.userId);
      return updatedMessage;
    },
    [channel],
  );
  const resendMessage: ReturnType<UseGroupChannelMessages>['resendMessage'] = useCallback(
    async (failedMessage) => {
      const message = await (() => {
        if (failedMessage.isUserMessage()) return channel.resendUserMessage(failedMessage);
        if (failedMessage.isFileMessage()) return channel.resendFileMessage(failedMessage);
        return null;
      })();

      if (message) updateMessages([message], false, sdk.currentUser.userId);
    },
    [channel],
  );
  const deleteMessage: ReturnType<UseGroupChannelMessages>['deleteMessage'] = useCallback(
    async (message) => {
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
    },
    [channel],
  );

  return {
    loading,
    refreshing,
    refresh,
    messages,
    nextMessages,
    newMessagesFromMembers,
    next,
    prev,
    sendUserMessage,
    sendFileMessage,
    updateUserMessage,
    updateFileMessage,
    resendMessage,
    deleteMessage,
  };
};
