import { useCallback, useEffect, useRef, useState } from 'react';
import type Sendbird from 'sendbird';

import type { SendbirdChatSDK } from '@sendbird/uikit-utils';
import { EmptyFunction, Logger, isDifferentChannel, useAsyncEffect, useForceUpdate } from '@sendbird/uikit-utils';

import useInternalPubSub from '../../common/useInternalPubSub';
import type { UseGroupChannelMessages, UseGroupChannelMessagesOptions } from '../../types';
import { useGroupChannelMessagesReducer } from './reducer';

const createMessageCollection = (
  sdk: SendbirdChatSDK,
  channel: Sendbird.GroupChannel,
  creator?: UseGroupChannelMessagesOptions['collectionCreator'],
) => {
  if (creator) return creator();
  const collection = channel.createMessageCollection();
  const filter = new sdk.MessageFilter();
  return collection.setLimit(100).setStartingPoint(Date.now()).setFilter(filter).build();
};

const hookName = 'useGroupChannelMessagesWithCollection';

export const useGroupChannelMessagesWithCollection = (
  sdk: SendbirdChatSDK,
  staleChannel: Sendbird.GroupChannel,
  userId?: string,
  options?: UseGroupChannelMessagesOptions,
): UseGroupChannelMessages => {
  const { events, publish } = useInternalPubSub();
  const collectionRef = useRef<Sendbird.MessageCollection>();

  // NOTE: We cannot determine the channel object of Sendbird SDK is stale or not, so force update after setActiveChannel
  const [activeChannel, setActiveChannel] = useState(() => staleChannel);
  const forceUpdate = useForceUpdate();

  const {
    loading,
    refreshing,
    messages,
    nextMessages,
    newMessagesFromNext,
    updateMessages,
    updateNextMessages,
    deleteNextMessages,
    deleteMessages,
    updateLoading,
    updateRefreshing,
  } = useGroupChannelMessagesReducer(userId, options?.sortComparator);

  const channelMarkAs = async () => {
    try {
      sdk.markAsDelivered(activeChannel.url);
    } catch (e) {
      Logger.error(`[${hookName}/channelMarkAs/Delivered]`, e);
    }
    try {
      await sdk.markAsReadWithChannelUrls([activeChannel.url]);
    } catch (e) {
      Logger.error(`[${hookName}/channelMarkAs/Read]`, e);
    }
  };

  const init = useCallback(
    async (uid?: string) => {
      if (collectionRef.current) collectionRef.current?.dispose();

      if (uid) {
        collectionRef.current = createMessageCollection(sdk, activeChannel, options?.collectionCreator);
        updateNextMessages([], true, sdk.currentUser.userId);
        channelMarkAs();

        collectionRef.current
          .initialize(sdk.MessageCollection.MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
          .onCacheResult((err, messages) => {
            if (err) sdk.isCacheEnabled && Logger.error(`[${hookName}/onCacheResult]`, err);
            else {
              Logger.debug(`[${hookName}/onCacheResult]`, 'message length:', messages.length);
              updateMessages(messages, true, sdk.currentUser.userId);
              updateMessages(collectionRef.current?.pendingMessages ?? [], false, sdk.currentUser.userId);
              updateMessages(collectionRef.current?.failedMessages ?? [], false, sdk.currentUser.userId);
            }
          })
          .onApiResult((err, messages) => {
            if (err) Logger.error(`[${hookName}/onApiResult]`, err);
            else {
              Logger.debug(`[${hookName}/onApiResult]`, 'message length:', messages.length);
              updateMessages(messages, true, sdk.currentUser.userId);
              updateMessages(collectionRef.current?.pendingMessages ?? [], false, sdk.currentUser.userId);
              updateMessages(collectionRef.current?.failedMessages ?? [], false, sdk.currentUser.userId);
            }
          });

        collectionRef.current.setMessageCollectionHandler({
          onMessagesAdded(_, __, messages) {
            channelMarkAs();
            updateNextMessages(messages, false, sdk.currentUser.userId);
          },
          onMessagesUpdated(_, __, messages) {
            updateNextMessages(messages, false, sdk.currentUser.userId);
          },
          onMessagesDeleted(_, __, messages) {
            const msgIds = messages.map((m) => m.messageId);
            const reqIds = messages
              .filter((m): m is Sendbird.UserMessage | Sendbird.FileMessage => 'reqId' in m)
              .map((m) => m.reqId);

            deleteMessages(msgIds, reqIds);
            deleteNextMessages(msgIds, reqIds);
          },
          onChannelDeleted(_, channelUrl) {
            publish(events.ChannelDeleted, { channelUrl }, hookName);
          },
          onChannelUpdated(_, channel) {
            if (channel.isGroupChannel() && !isDifferentChannel(channel, activeChannel)) {
              setActiveChannel(channel);
              forceUpdate();
            }
            publish(events.ChannelUpdated, { channel }, hookName);
          },
          onHugeGapDetected() {
            init(uid);
          },
        });
      }
    },
    [sdk, activeChannel, options?.collectionCreator],
  );
  useEffect(() => {
    return () => {
      if (collectionRef.current) collectionRef.current?.dispose();
    };
  }, []);
  useAsyncEffect(async () => {
    updateLoading(true);
    await init(userId);
    updateLoading(false);
  }, [init, userId]);

  const refresh: UseGroupChannelMessages['refresh'] = useCallback(async () => {
    updateRefreshing(true);
    await init(userId);
    updateRefreshing(false);
  }, [init, userId]);

  const prev: UseGroupChannelMessages['prev'] = useCallback(async () => {
    if (collectionRef.current && collectionRef.current?.hasPrevious) {
      try {
        const list = await collectionRef.current?.loadPrevious();
        updateMessages(list, false, sdk.currentUser.userId);
      } catch {}
    }
  }, []);

  const next: UseGroupChannelMessages['next'] = useCallback(async () => {
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

  const sendUserMessage: UseGroupChannelMessages['sendUserMessage'] = useCallback(
    (params, onSent) => {
      const pendingMessage = activeChannel.sendUserMessage(params, (sentMessage, error) => {
        onSent?.(pendingMessage, error);
        if (!error && sentMessage) updateMessages([sentMessage], false, sdk.currentUser.userId);
      });
      updateMessages([pendingMessage], false, sdk.currentUser.userId);

      return pendingMessage;
    },
    [activeChannel],
  );
  const sendFileMessage: UseGroupChannelMessages['sendFileMessage'] = useCallback(
    (params, onSent) => {
      const pendingMessage = activeChannel.sendFileMessage(params, (sentMessage, error) => {
        onSent?.(pendingMessage, error);
        if (!error && sentMessage) updateMessages([sentMessage], false, sdk.currentUser.userId);
      });
      updateMessages([pendingMessage], false, sdk.currentUser.userId);

      return pendingMessage;
    },
    [activeChannel],
  );
  const updateUserMessage: UseGroupChannelMessages['updateUserMessage'] = useCallback(
    async (messageId, params) => {
      const updatedMessage = await activeChannel.updateUserMessage(messageId, params, EmptyFunction);
      updateMessages([updatedMessage], false, sdk.currentUser.userId);
      return updatedMessage;
    },
    [activeChannel],
  );
  const updateFileMessage: UseGroupChannelMessages['updateFileMessage'] = useCallback(
    async (messageId, params) => {
      const updatedMessage = await activeChannel.updateFileMessage(messageId, params, EmptyFunction);
      updateMessages([updatedMessage], false, sdk.currentUser.userId);
      return updatedMessage;
    },
    [activeChannel],
  );
  const resendMessage: UseGroupChannelMessages['resendMessage'] = useCallback(
    async (failedMessage) => {
      if (!failedMessage.isResendable()) return;

      const message = await (() => {
        if (failedMessage.isUserMessage()) return activeChannel.resendUserMessage(failedMessage);
        if (failedMessage.isFileMessage()) return activeChannel.resendFileMessage(failedMessage);
        return null;
      })();

      if (message) updateMessages([message], false, sdk.currentUser.userId);
    },
    [activeChannel],
  );
  const deleteMessage: UseGroupChannelMessages['deleteMessage'] = useCallback(
    async (message) => {
      if (message.sendingStatus === 'succeeded') {
        if (message.isUserMessage()) await activeChannel.deleteMessage(message);
        if (message.isFileMessage()) await activeChannel.deleteMessage(message);
      } else {
        deleteMessages([message.messageId], [message.reqId]);
      }
    },
    [activeChannel],
  );

  return {
    loading,
    refreshing,
    refresh,
    messages,
    nextMessages,
    newMessagesFromNext,
    next,
    prev,
    sendUserMessage,
    sendFileMessage,
    updateUserMessage,
    updateFileMessage,
    resendMessage,
    deleteMessage,
    activeChannel,
  };
};
