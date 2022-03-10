import { useCallback, useRef } from 'react';
import type Sendbird from 'sendbird';

import type { SendbirdChatSDK } from '@sendbird/uikit-utils';
import { isDifferentChannel, useAsyncEffect } from '@sendbird/uikit-utils';

import useChannelHandler from '../../handler/useChannelHandler';
import type { UseGroupChannelMessages, UseGroupChannelMessagesOptions } from '../../types';
import { useGroupChannelMessagesReducer } from './reducer';

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
  const queryRef = useRef<Sendbird.PreviousMessageListQuery>();

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

  const init = useCallback(
    async (uid?: string) => {
      if (uid) {
        queryRef.current = createMessageQuery(channel, options?.queryCreator);
        if (queryRef.current?.hasMore) {
          const list = await queryRef.current?.load();
          updateMessages(list, true);
        }
        updateNextMessages([], true);
      }
    },
    [sdk, channel, options?.queryCreator],
  );
  useAsyncEffect(async () => {
    updateLoading(true);
    await init(userId);
    updateLoading(false);
  }, [init, userId]);
  useChannelHandler(
    sdk,
    'useGroupChannelMessagesWithQuery',
    {
      onMessageReceived(eventChannel, message) {
        if (isDifferentChannel(channel, eventChannel)) return;
        sdk.markAsDelivered(channel.url);
        sdk.markAsReadWithChannelUrls([channel.url]);
        updateNextMessages([message], false);
      },
      onMessageUpdated(eventChannel, message) {
        if (isDifferentChannel(channel, eventChannel)) return;
        updateNextMessages([message], false);
      },
      onMessageDeleted(eventChannel, messageId) {
        if (isDifferentChannel(channel, eventChannel)) return;
        deleteMessages([messageId], []);
        deleteNextMessages([messageId], []);
      },
    },
    [sdk],
  );

  const refresh: UseGroupChannelMessages['refresh'] = useCallback(async () => {
    updateRefreshing(true);
    await init(userId);
    updateRefreshing(false);
  }, [init, userId]);

  const prev: UseGroupChannelMessages['prev'] = useCallback(async () => {
    if (queryRef.current && queryRef.current?.hasMore) {
      const list = await queryRef.current?.load();
      updateMessages(list, false);
    }
  }, []);

  const next: UseGroupChannelMessages['next'] = useCallback(async () => {
    if (nextMessages.length > 0) {
      updateMessages(nextMessages, false);
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
