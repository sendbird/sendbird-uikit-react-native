import { useCallback, useRef } from 'react';
import type Sendbird from 'sendbird';

import type { SendbirdFileMessage, SendbirdGroupChannel, SendbirdOpenChannel } from '@sendbird/uikit-utils';
import { Logger, isDifferentChannel, useAsyncEffect, useForceUpdate } from '@sendbird/uikit-utils';

import { useAppFeatures } from '../../common/useAppFeatures';
import { useChannelHandler } from '../../handler/useChannelHandler';
import type { UseGroupChannelMessages, UseGroupChannelMessagesOptions } from '../../types';
import { useActiveGroupChannel } from '../useActiveGroupChannel';
import { useGroupChannelMessagesReducer } from './reducer';

const createMessageQuery = (
  channel: SendbirdGroupChannel,
  creator?: UseGroupChannelMessagesOptions['queryCreator'],
) => {
  if (creator) return creator();
  const query = channel.createPreviousMessageListQuery();
  query.limit = 100;
  query.reverse = true;
  return query;
};

const HOOK_NAME = 'useGroupChannelMessagesWithQuery';
export const useGroupChannelMessagesWithQuery: UseGroupChannelMessages = (sdk, channel, userId, options) => {
  const { deliveryReceiptEnabled } = useAppFeatures(sdk);

  const queryRef = useRef<Sendbird.PreviousMessageListQuery>();

  // NOTE: We cannot determine the channel object of Sendbird SDK is stale or not, so force update after setActiveChannel
  const { activeChannel, setActiveChannel } = useActiveGroupChannel(sdk, channel);
  const forceUpdate = useForceUpdate();

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
      if (deliveryReceiptEnabled) sdk.markAsDelivered(activeChannel.url);
    } catch (e) {
      Logger.warn(`[${HOOK_NAME}/channelMarkAs/Delivered]`, e);
    }
    try {
      await sdk.markAsReadWithChannelUrls([activeChannel.url]);
    } catch (e) {
      Logger.warn(`[${HOOK_NAME}/channelMarkAs/Read]`, e);
    }
  };

  const init = useCallback(
    async (uid?: string) => {
      if (uid) {
        queryRef.current = createMessageQuery(activeChannel, options?.queryCreator);
        channelMarkAs();
        if (queryRef.current?.hasMore) {
          const list = await queryRef.current?.load();
          updateMessages(list, true, sdk.currentUser.userId);
        }
        updateNextMessages([], true, sdk.currentUser.userId);
      }
    },
    [sdk, activeChannel.url, options?.queryCreator],
  );

  const channelUpdater = (channel: SendbirdGroupChannel | SendbirdOpenChannel) => {
    if (channel.isGroupChannel() && !isDifferentChannel(channel, activeChannel)) {
      setActiveChannel(channel);
      forceUpdate();
    }
  };

  useChannelHandler(sdk, HOOK_NAME, {
    // Messages
    onMessageReceived(eventChannel, message) {
      if (isDifferentChannel(activeChannel, eventChannel)) return;
      channelMarkAs();
      updateNextMessages([message], false, sdk.currentUser.userId);
    },
    onMessageUpdated(eventChannel, message) {
      if (isDifferentChannel(activeChannel, eventChannel)) return;
      updateMessages([message], false, sdk.currentUser.userId);
    },
    onMessageDeleted(eventChannel, messageId) {
      if (isDifferentChannel(activeChannel, eventChannel)) return;
      deleteMessages([messageId], []);
      deleteNextMessages([messageId], []);
    },
    // Channels
    onChannelChanged: channelUpdater,
    onChannelFrozen: channelUpdater,
    onChannelUnfrozen: channelUpdater,
    onChannelHidden: channelUpdater,
    onChannelMemberCountChanged(channels) {
      const channel = channels.find((c) => !isDifferentChannel(c, activeChannel));
      if (channel) channelUpdater(channel);
    },
    onChannelDeleted(channelUrl: string) {
      if (activeChannel.url === channelUrl) options?.onChannelDeleted?.();
    },
    // Users
    onOperatorUpdated: channelUpdater,
    onUserLeft: channelUpdater,
    onUserEntered: channelUpdater,
    onUserExited: channelUpdater,
    onUserJoined: channelUpdater,
    onUserUnbanned: channelUpdater,
    onUserMuted: channelUpdater,
    onUserUnmuted: channelUpdater,
    onUserBanned(eventChannel, bannedUser) {
      if (isDifferentChannel(activeChannel, eventChannel)) return;

      if (bannedUser.userId === sdk.currentUser.userId) {
        options?.onChannelDeleted?.();
      } else {
        channelUpdater(eventChannel);
      }
    },
  });

  useAsyncEffect(async () => {
    updateLoading(true);
    await init(userId);
    updateLoading(false);
  }, [init, userId]);

  const refresh: ReturnType<UseGroupChannelMessages>['refresh'] = useCallback(async () => {
    updateRefreshing(true);
    await init(userId);
    updateRefreshing(false);
  }, [init, userId]);

  const prev: ReturnType<UseGroupChannelMessages>['prev'] = useCallback(async () => {
    if (queryRef.current && queryRef.current?.hasMore) {
      const list = await queryRef.current?.load();
      updateMessages(list, false, sdk.currentUser.userId);
    }
  }, []);

  const next: ReturnType<UseGroupChannelMessages>['next'] = useCallback(async () => {
    if (nextMessages.length > 0) {
      updateMessages(nextMessages, false, sdk.currentUser.userId);
      updateNextMessages([], true, sdk.currentUser.userId);
    }
  }, [nextMessages.length]);

  const sendUserMessage: ReturnType<UseGroupChannelMessages>['sendUserMessage'] = useCallback(
    (params, onPending) => {
      return new Promise((resolve, reject) => {
        const pendingMessage = activeChannel.sendUserMessage(params, (sentMessage, error) => {
          if (error) reject(error);
          else {
            updateNextMessages([sentMessage], false, sdk.currentUser.userId);
            resolve(sentMessage);
          }
        });
        updateNextMessages([pendingMessage], false, sdk.currentUser.userId);
        onPending?.(pendingMessage);
      });
    },
    [activeChannel],
  );
  const sendFileMessage: ReturnType<UseGroupChannelMessages>['sendFileMessage'] = useCallback(
    (params, onPending) => {
      return new Promise((resolve, reject) => {
        const pendingMessage = activeChannel.sendFileMessage(params, (sentMessage, error) => {
          if (error) reject(error);
          else {
            updateNextMessages([sentMessage], false, sdk.currentUser.userId);
            resolve(sentMessage as SendbirdFileMessage);
          }
        });
        updateNextMessages([pendingMessage], false, sdk.currentUser.userId);
        onPending?.(pendingMessage);
      });
    },
    [activeChannel],
  );
  const updateUserMessage: ReturnType<UseGroupChannelMessages>['updateUserMessage'] = useCallback(
    async (messageId, params) => {
      const updatedMessage = await activeChannel.updateUserMessage(messageId, params);
      updateMessages([updatedMessage], false, sdk.currentUser.userId);
      return updatedMessage;
    },
    [activeChannel],
  );
  const updateFileMessage: ReturnType<UseGroupChannelMessages>['updateFileMessage'] = useCallback(
    async (messageId, params) => {
      const updatedMessage = await activeChannel.updateFileMessage(messageId, params);
      updateMessages([updatedMessage], false, sdk.currentUser.userId);
      return updatedMessage;
    },
    [activeChannel],
  );
  const resendMessage: ReturnType<UseGroupChannelMessages>['resendMessage'] = useCallback(
    async (failedMessage) => {
      const message = await (() => {
        if (failedMessage.isUserMessage()) return activeChannel.resendUserMessage(failedMessage);
        if (failedMessage.isFileMessage()) return activeChannel.resendFileMessage(failedMessage);
        return null;
      })();

      if (message) updateNextMessages([message], false, sdk.currentUser.userId);
    },
    [activeChannel],
  );
  const deleteMessage: ReturnType<UseGroupChannelMessages>['deleteMessage'] = useCallback(
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
    newMessagesFromMembers,
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
