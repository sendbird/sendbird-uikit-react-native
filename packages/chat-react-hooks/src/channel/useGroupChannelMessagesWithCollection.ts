import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type Sendbird from 'sendbird';

import type { SendbirdChatSDK, SendbirdMessage } from '@sendbird/uikit-utils';
import { Logger, arrayToMap, useAsyncEffect } from '@sendbird/uikit-utils';

import useInternalPubSub from '../common/useInternalPubSub';
import type { UseGroupChannelMessages, UseGroupChannelMessagesOptions } from '../types';

const createMessageCollection = (
  sdk: SendbirdChatSDK,
  channel: Sendbird.GroupChannel,
  creator?: UseGroupChannelMessagesOptions['collectionCreator'],
) => {
  if (creator) return creator();
  const collection = channel.createMessageCollection();
  const filter = new sdk.MessageFilter();
  return collection.setLimit(50).setStartingPoint(Date.now()).setFilter(filter).build();
};

export const useGroupChannelMessagesWithCollection = (
  sdk: SendbirdChatSDK,
  channel: Sendbird.GroupChannel,
  userId?: string,
  options?: UseGroupChannelMessagesOptions,
): UseGroupChannelMessages => {
  const { events, publish } = useInternalPubSub();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const collectionRef = useRef<Sendbird.MessageCollection>();

  const [messageMap, setMessageMap] = useState<Record<string, SendbirdMessage>>({});
  const messages = useMemo(() => {
    if (options?.sortComparator) return Object.values(messageMap).sort(options?.sortComparator);
    return Object.values(messageMap);
  }, [options?.sortComparator, messageMap]);

  const [nextMessageMap, setNextMessageMap] = useState<Record<string, SendbirdMessage>>({});
  const nextMessages = Object.values(nextMessageMap);
  const newMessagesFromNext = nextMessages.filter((msg) => {
    const isMyMessage = 'sender' in msg && msg.sender?.userId === userId;
    if (isMyMessage) return false;
    if (msg.isAdminMessage()) return false;
    return msg.updatedAt === 0;
  });

  // ---------- internal methods ------------ //
  const updateMessages = (messages: Sendbird.BaseMessageInstance[]) => {
    setMessageMap((prev) => ({ ...prev, ...arrayToMap(messages, 'reqId', 'messageId') }));
  };
  const deleteMessages = (messages: SendbirdMessage[]) => {
    setMessageMap(({ ...draft }) => {
      messages.forEach((msg) => {
        delete draft[msg.messageId];
        'reqId' in msg && delete draft[msg.reqId];
      });
      return draft;
    });
  };
  const updateNextMessages = (messages: Sendbird.BaseMessageInstance[]) => {
    setNextMessageMap((prev) => ({ ...prev, ...arrayToMap(messages, 'reqId', 'messageId') }));
  };
  const deleteNextMessages = (messages: SendbirdMessage[]) => {
    setNextMessageMap(({ ...draft }) => {
      messages.forEach((msg) => {
        delete draft[msg.messageId];
        'reqId' in msg && delete draft[msg.reqId];
      });
      return draft;
    });
  };
  const clearAllMessages = () => {
    setMessageMap({});
    setNextMessageMap({});
  };
  const init = useCallback(
    async (uid?: string) => {
      if (collectionRef.current) collectionRef.current?.dispose();
      clearAllMessages();

      if (uid) {
        collectionRef.current = createMessageCollection(sdk, channel, options?.collectionCreator);
        collectionRef.current
          .initialize(sdk.MessageCollection.MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
          .onCacheResult((err, messages) => {
            if (err) Logger.error('[useGroupChannelMessagesWithCollection/onCacheResult]', err);
            else updateMessages(messages);
          })
          .onApiResult((err, messages) => {
            if (err) Logger.error('[useGroupChannelMessagesWithCollection/onApiResult]', err);
            else updateMessages(messages);
          });

        collectionRef.current.setMessageCollectionHandler({
          onMessagesAdded(_, __, messages) {
            sdk.markAsDelivered(channel.url);
            sdk.markAsReadWithChannelUrls([channel.url]);
            updateNextMessages(messages);
          },
          onMessagesUpdated(_, __, messages) {
            updateNextMessages(messages);
          },
          onMessagesDeleted(_, __, messages) {
            deleteMessages(messages);
            deleteNextMessages(messages);
          },
          onChannelDeleted(_, channelUrl) {
            publish(events.ChannelDeleted, { channelUrl });
          },
          onChannelUpdated(_, channel) {
            publish(events.ChannelUpdated, { channel });
          },
          onHugeGapDetected() {
            init(uid);
          },
        });

        await prev();
      }
    },
    [sdk, channel, options?.collectionCreator],
  );
  // ---------- internal methods ends ------------ //

  // ---------- internal hooks ---------- //
  useEffect(() => {
    return () => {
      if (collectionRef.current) collectionRef.current?.dispose();
    };
  }, []);
  useAsyncEffect(async () => {
    setLoading(true);
    await init(userId);
    setLoading(false);
  }, [init, userId]);
  // ---------- internal hooks ends ---------- //

  // ---------- returns methods ---------- //
  const refresh = useCallback(async () => {
    setRefreshing(true);
    await init(userId);
    setRefreshing(false);
  }, [init, userId]);

  const prev = useCallback(async () => {
    if (collectionRef.current && collectionRef.current?.hasPrevious) {
      const list = await collectionRef.current?.loadPrevious();
      updateMessages(list);
    }
  }, []);

  const next = useCallback(async () => {
    const list = [];
    if (collectionRef.current && collectionRef.current?.hasNext) {
      const fetchedList = await collectionRef.current?.loadNext();
      list.push(...fetchedList);
    }
    if (nextMessages.length > 0) {
      list.push(...nextMessages);
    }
    if (list.length > 0) {
      updateMessages(list);
    }
  }, []);

  const sendUserMessage: UseGroupChannelMessages['sendUserMessage'] = useCallback(
    (params, onSent) => {
      const pendingMessage = channel.sendUserMessage(params, (message, error) => {
        onSent?.(pendingMessage, error);
        if (!error && message) {
          updateNextMessages([message]);
          next();
        }
      });
      updateNextMessages([pendingMessage]);
      next();

      return pendingMessage;
    },
    [channel],
  );
  const sendFileMessage: UseGroupChannelMessages['sendFileMessage'] = useCallback(
    (params, onSent) => {
      const pendingMessage = channel.sendFileMessage(params, (message, error) => {
        onSent?.(pendingMessage, error);
        if (!error && message) {
          updateNextMessages([message]);
          next();
        }
      });
      updateNextMessages([pendingMessage]);
      next();

      return pendingMessage;
    },
    [channel],
  );
  // ---------- returns methods ends ---------- //

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
  };
};
