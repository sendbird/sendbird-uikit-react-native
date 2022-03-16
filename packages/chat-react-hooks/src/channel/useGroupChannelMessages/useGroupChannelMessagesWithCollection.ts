import { useCallback, useEffect, useRef } from 'react';
import type Sendbird from 'sendbird';

import type { SendbirdChatSDK } from '@sendbird/uikit-utils';
import { Logger, useAsyncEffect } from '@sendbird/uikit-utils';

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
  channel: Sendbird.GroupChannel,
  userId?: string,
  options?: UseGroupChannelMessagesOptions,
): UseGroupChannelMessages => {
  const { events, publish } = useInternalPubSub();
  const collectionRef = useRef<Sendbird.MessageCollection>();

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
      sdk.markAsDelivered(channel.url);
      await sdk.markAsReadWithChannelUrls([channel.url]);
    } catch (e) {
      Logger.error(`[${hookName}/channelMarkAs]`, e);
    }
  };

  const init = useCallback(
    async (uid?: string) => {
      if (collectionRef.current) collectionRef.current?.dispose();

      if (uid) {
        collectionRef.current = createMessageCollection(sdk, channel, options?.collectionCreator);
        updateNextMessages([], true);
        channelMarkAs();

        collectionRef.current
          .initialize(sdk.MessageCollection.MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
          .onCacheResult((err, messages) => {
            if (err) sdk.isCacheEnabled && Logger.error(`[${hookName}/onCacheResult]`, err);
            else {
              updateMessages(messages, true);
              updateMessages(collectionRef.current?.pendingMessages ?? [], false);
              updateMessages(collectionRef.current?.failedMessages ?? [], false);
            }
          })
          .onApiResult((err, messages) => {
            if (err) Logger.error(`[${hookName}/onApiResult]`, err);
            else {
              updateMessages(messages, true);
              updateMessages(collectionRef.current?.pendingMessages ?? [], false);
              updateMessages(collectionRef.current?.failedMessages ?? [], false);
            }
          });

        collectionRef.current.setMessageCollectionHandler({
          onMessagesAdded(_, __, messages) {
            channelMarkAs();
            updateNextMessages(messages, false);
          },
          onMessagesUpdated(_, __, messages) {
            updateNextMessages(messages, false);
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
            publish(events.ChannelUpdated, { channel }, hookName);
          },
          onHugeGapDetected() {
            init(uid);
          },
        });
      }
    },
    [sdk, channel, options?.collectionCreator],
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
        updateMessages(list, false);
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
      updateMessages(list, false);
      updateNextMessages([], true);
    }
  }, [nextMessages.length]);

  const sendUserMessage: UseGroupChannelMessages['sendUserMessage'] = useCallback(
    (params, onSent) => {
      const pendingMessage = channel.sendUserMessage(params, (sentMessage, error) => {
        onSent?.(pendingMessage, error);
        if (!error && sentMessage) updateMessages([sentMessage], false);
      });
      updateMessages([pendingMessage], false);

      return pendingMessage;
    },
    [channel],
  );
  const sendFileMessage: UseGroupChannelMessages['sendFileMessage'] = useCallback(
    (params, onSent) => {
      const pendingMessage = channel.sendFileMessage(params, (sentMessage, error) => {
        onSent?.(pendingMessage, error);
        if (!error && sentMessage) updateMessages([sentMessage], false);
      });
      updateMessages([pendingMessage], false);

      return pendingMessage;
    },
    [channel],
  );
  const resendMessage: UseGroupChannelMessages['resendMessage'] = useCallback(
    async (failedMessage) => {
      if (!failedMessage.isResendable()) return;

      const message = await (() => {
        if (failedMessage.isUserMessage()) return channel.resendUserMessage(failedMessage);
        if (failedMessage.isFileMessage()) return channel.resendFileMessage(failedMessage);
        return null;
      })();

      if (message) updateMessages([message], false);
    },
    [channel],
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
    resendMessage,
  };
};
