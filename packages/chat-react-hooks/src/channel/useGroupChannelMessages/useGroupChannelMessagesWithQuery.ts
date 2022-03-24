import { useCallback, useRef, useState } from 'react';
import type Sendbird from 'sendbird';

import type { SendbirdChatSDK } from '@sendbird/uikit-utils';
import { Logger, isDifferentChannel, useAsyncEffect, useForceUpdate } from '@sendbird/uikit-utils';

import { useChannelHandler } from '../../handler/useChannelHandler';
import type { UseGroupChannelMessages, UseGroupChannelMessagesOptions } from '../../types';
import { useGroupChannelMessagesReducer } from './reducer';

const createMessageQuery = (
  channel: Sendbird.GroupChannel,
  creator?: UseGroupChannelMessagesOptions['queryCreator'],
) => {
  if (creator) return creator();
  const query = channel.createPreviousMessageListQuery();
  query.limit = 100;
  query.reverse = true;
  return query;
};

const hookName = 'useGroupChannelMessagesWithQuery';
export const useGroupChannelMessagesWithQuery = (
  sdk: SendbirdChatSDK,
  staleChannel: Sendbird.GroupChannel,
  userId?: string,
  options?: UseGroupChannelMessagesOptions,
): UseGroupChannelMessages => {
  const queryRef = useRef<Sendbird.PreviousMessageListQuery>();

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
      if (uid) {
        queryRef.current = createMessageQuery(activeChannel, options?.queryCreator);
        channelMarkAs();
        if (queryRef.current?.hasMore) {
          const list = await queryRef.current?.load();
          updateMessages(list, true);
        }
        updateNextMessages([], true);
      }
    },
    [sdk, activeChannel, options?.queryCreator],
  );
  useAsyncEffect(async () => {
    updateLoading(true);
    await init(userId);
    updateLoading(false);
  }, [init, userId]);

  const channelUpdater = (channel: Sendbird.GroupChannel | Sendbird.OpenChannel) => {
    if (!channel.isGroupChannel() || isDifferentChannel(channel, activeChannel)) return;
    setActiveChannel(channel);
    forceUpdate();
  };

  useChannelHandler(
    sdk,
    hookName,
    {
      onMessageReceived(eventChannel, message) {
        if (isDifferentChannel(activeChannel, eventChannel)) return;
        channelMarkAs();
        updateNextMessages([message], false);
      },
      onMessageUpdated(eventChannel, message) {
        if (isDifferentChannel(activeChannel, eventChannel)) return;
        updateNextMessages([message], false);
      },
      onMessageDeleted(eventChannel, messageId) {
        if (isDifferentChannel(activeChannel, eventChannel)) return;
        deleteMessages([messageId], []);
        deleteNextMessages([messageId], []);
      },
      onChannelMemberCountChanged(channels) {
        const channel = channels.find((c) => !isDifferentChannel(c, activeChannel));
        if (channel) {
          setActiveChannel(channel);
          forceUpdate();
        }
      },
      onChannelChanged: channelUpdater,
      onChannelFrozen: channelUpdater,
      onChannelUnfrozen: channelUpdater,
      onChannelHidden: channelUpdater,
      onUserBanned: channelUpdater,
      onUserUnbanned: channelUpdater,
      onUserMuted: channelUpdater,
      onUserUnmuted: channelUpdater,
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
      updateNextMessages([], true);
    }
  }, [nextMessages.length]);

  const sendUserMessage: UseGroupChannelMessages['sendUserMessage'] = useCallback(
    (params, onSent) => {
      const pendingMessage = activeChannel.sendUserMessage(params, (sentMessage, error) => {
        onSent?.(pendingMessage, error);
        if (!error && sentMessage) updateNextMessages([sentMessage], false);
      });
      updateNextMessages([pendingMessage], false);

      return pendingMessage;
    },
    [activeChannel],
  );
  const sendFileMessage: UseGroupChannelMessages['sendFileMessage'] = useCallback(
    (params, onSent) => {
      const pendingMessage = activeChannel.sendFileMessage(params, (sentMessage, error) => {
        onSent?.(pendingMessage, error);
        if (!error && sentMessage) updateNextMessages([sentMessage], false);
      });
      updateNextMessages([pendingMessage], false);

      return pendingMessage;
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

      if (message) updateNextMessages([message], false);
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
    resendMessage,
    activeChannel,
  };
};
