import { useCallback, useMemo, useRef, useState } from 'react';
import type Sendbird from 'sendbird';

import type { SendbirdChatSDK, SendbirdMessage } from '@sendbird/uikit-utils';
import { arrayToMap, isDifferentChannel, useAsyncEffect } from '@sendbird/uikit-utils';

import useChannelHandler from '../handler/useChannelHandler';
import type { UseGroupChannelMessages, UseGroupChannelMessagesOptions } from '../types';

const createMessageQuery = (
  channel: Sendbird.GroupChannel,
  creator?: UseGroupChannelMessagesOptions['queryCreator'],
) => {
  if (creator) return creator();
  const query = channel.createPreviousMessageListQuery();
  query.limit = 50;
  query.reverse = true;
  return query;
};

export const useGroupChannelMessagesWithQuery = (
  sdk: SendbirdChatSDK,
  channel: Sendbird.GroupChannel,
  userId?: string,
  options?: UseGroupChannelMessagesOptions,
): UseGroupChannelMessages => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const queryRef = useRef<Sendbird.PreviousMessageListQuery>();

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
  const deleteMessage = (messageId: number) => {
    setMessageMap(({ ...draft }) => {
      if (draft[messageId]) delete draft[messageId];
      else {
        const message = Object.values(draft).find((msg) => msg.messageId === messageId);
        if (message && 'reqId' in message) delete draft[message.reqId];
      }
      return draft;
    });
  };
  const updateNextMessages = (messages: Sendbird.BaseMessageInstance[]) => {
    setNextMessageMap((prev) => ({ ...prev, ...arrayToMap(messages, 'reqId', 'messageId') }));
  };
  const deleteNextMessages = (messageId: number) => {
    setNextMessageMap(({ ...draft }) => {
      if (draft[messageId]) delete draft[messageId];
      else {
        const message = Object.values(draft).find((msg) => msg.messageId === messageId);
        if (message && 'reqId' in message) delete draft[message.reqId];
      }
      return draft;
    });
  };
  const clearAllMessages = () => {
    setMessageMap({});
    setNextMessageMap({});
  };
  const init = useCallback(
    async (uid?: string) => {
      clearAllMessages();

      if (uid) {
        queryRef.current = createMessageQuery(channel, options?.queryCreator);
        await prev();
      }
    },
    [sdk, channel, options?.queryCreator],
  );
  // ---------- internal methods ends ------------ //

  // ---------- internal hooks ---------- //
  useAsyncEffect(async () => {
    setLoading(true);
    await init(userId);
    setLoading(false);
  }, [init, userId]);
  useChannelHandler(
    sdk,
    'useGroupChannelMessagesWithQuery',
    {
      onMessageReceived(eventChannel, message) {
        if (isDifferentChannel(channel, eventChannel)) return;
        sdk.markAsDelivered(channel.url);
        sdk.markAsReadWithChannelUrls([channel.url]);
        updateNextMessages([message]);
      },
      onMessageUpdated(eventChannel, message) {
        if (isDifferentChannel(channel, eventChannel)) return;
        updateNextMessages([message]);
      },
      onMessageDeleted(eventChannel, messageId) {
        if (isDifferentChannel(channel, eventChannel)) return;
        deleteMessage(messageId);
        deleteNextMessages(messageId);
      },
    },
    [sdk],
  );
  // ---------- internal hooks ends ---------- //

  // ---------- returns methods ---------- //
  const refresh = useCallback(async () => {
    setRefreshing(true);
    await init(userId);
    setRefreshing(false);
  }, [init, userId]);

  const prev = useCallback(async () => {
    if (queryRef.current && queryRef.current?.hasMore) {
      const list = await queryRef.current?.load();
      updateMessages(list);
    }
  }, []);

  const next = useCallback(async () => {
    if (nextMessages.length > 0) {
      updateMessages(nextMessages);
    }
  }, [nextMessages.length]);

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
