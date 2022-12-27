import { useCallback, useEffect, useRef } from 'react';

import { MessageCollectionInitPolicy, MessageEventSource, MessageFilter } from '@sendbird/chat/groupChannel';
import type {
  SendbirdBaseMessage,
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdMessageCollection,
} from '@sendbird/uikit-utils';
import {
  Logger,
  confirmAndMarkAsRead,
  isDifferentChannel,
  useForceUpdate,
  useFreshCallback,
} from '@sendbird/uikit-utils';

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
      Logger.warn(`[${HOOK_NAME}/channelMarkAsRead]`, e);
    }
  };

  const init = useCallback(
    async (uid?: string, callback?: () => void) => {
      if (collectionRef.current) collectionRef.current?.dispose();

      if (uid) {
        collectionRef.current = createMessageCollection(channel, options?.collectionCreator);
        updateNextMessages([], true, sdk.currentUser.userId);
        channelMarkAsRead();

        collectionRef.current?.setMessageCollectionHandler({
          onMessagesAdded: (_, __, messages) => {
            channelMarkAsRead(_.source);
            updateNextMessages(messages, false, sdk.currentUser.userId);
          },
          onMessagesUpdated: (_, __, messages) => {
            channelMarkAsRead(_.source);

            // NOTE: admin message is not added via onMessagesAdded handler, not checked yet is this a bug.
            if (_.source === MessageEventSource.EVENT_MESSAGE_RECEIVED) {
              const nextMessageIds = nextMessages.map((it) => it.messageId);
              const nonAddedMessagesFromReceivedEvent = messages.filter(
                (it) => nextMessageIds.indexOf(it.messageId) === -1,
              );
              updateNextMessages(nonAddedMessagesFromReceivedEvent, false, sdk.currentUser.userId);
            }

            // NOTE: v4 MESSAGE_RECEIVED is called twice from onMessagesAdded and onMessagesUpdated when receiving new message.
            //  This is not intended behavior but not bugs.
            if (_.source !== MessageEventSource.EVENT_MESSAGE_RECEIVED) {
              updateMessages(messages, false, sdk.currentUser.userId);
            }
          },
          onMessagesDeleted: (_, __, messageIds) => {
            deleteMessages(messageIds, []);
            deleteNextMessages(messageIds, []);
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

  const refresh: ReturnType<UseGroupChannelMessages>['refresh'] = useFreshCallback(async () => {
    updateRefreshing(true);
    init(userId, () => updateRefreshing(false));
  });

  const prev: ReturnType<UseGroupChannelMessages>['prev'] = useFreshCallback(async () => {
    if (collectionRef.current && collectionRef.current?.hasPrevious) {
      try {
        const list = await collectionRef.current?.loadPrevious();
        updateMessages(list, false, sdk.currentUser.userId);
      } catch {}
    }
  });

  const next: ReturnType<UseGroupChannelMessages>['next'] = useFreshCallback(async () => {
    const messageCandidates: SendbirdBaseMessage[] = [];

    if (collectionRef.current && collectionRef.current?.hasNext) {
      try {
        const fetchedList = await collectionRef.current?.loadNext();
        messageCandidates.push(...fetchedList);
      } catch {}
    }

    if (nextMessages.length > 0) {
      messageCandidates.push(...nextMessages);
    }

    if (messageCandidates.length > 0) {
      updateMessages(messageCandidates, false, sdk.currentUser.userId);
      updateNextMessages([], true, sdk.currentUser.userId);
    }
  });

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
