import { useRef } from 'react';

import type {
  SendbirdBaseChannel,
  SendbirdGroupChannel,
  SendbirdPreviousMessageListQuery,
} from '@sendbird/uikit-utils';
import {
  Logger,
  confirmAndMarkAsRead,
  isDifferentChannel,
  useAsyncEffect,
  useForceUpdate,
  useFreshCallback,
  useUniqHandlerId,
} from '@sendbird/uikit-utils';

import { useChannelHandler } from '../../handler/useChannelHandler';
import type { UseGroupChannelMessages, UseGroupChannelMessagesOptions } from '../../types';
import { useGroupChannelMessagesReducer } from './reducer';

const createMessageQuery = (
  channel: SendbirdGroupChannel,
  creator?: UseGroupChannelMessagesOptions['queryCreator'],
) => {
  if (creator) return creator();
  return channel.createPreviousMessageListQuery({
    limit: 100,
    reverse: true,
  });
};

export const useGroupChannelMessagesWithQuery: UseGroupChannelMessages = (sdk, channel, userId, options) => {
  const queryRef = useRef<SendbirdPreviousMessageListQuery>();
  const handlerId = useUniqHandlerId('useGroupChannelMessagesWithQuery');

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

  const channelMarkAsRead = async () => {
    try {
      await confirmAndMarkAsRead([channel]);
    } catch (e) {
      Logger.warn('[useGroupChannelMessagesWithQuery/channelMarkAsRead]', e);
    }
  };

  const init = useFreshCallback(async (uid?: string) => {
    if (uid) {
      queryRef.current = createMessageQuery(channel, options?.queryCreator);
      channelMarkAsRead();
      if (queryRef.current?.hasNext) {
        const list = await queryRef.current?.load();
        updateMessages(list, true, sdk.currentUser.userId);
      }
      updateNextMessages([], true, sdk.currentUser.userId);
    }
  });

  const channelUpdater = (channel: SendbirdBaseChannel) => {
    if (channel.isGroupChannel() && !isDifferentChannel(channel, channel)) {
      forceUpdate();
    }
  };

  useChannelHandler(sdk, handlerId, {
    // Messages
    onMessageReceived(eventChannel, message) {
      if (isDifferentChannel(channel, eventChannel)) return;
      channelMarkAsRead();
      updateNextMessages([message], false, sdk.currentUser.userId);
    },
    onMessageUpdated(eventChannel, message) {
      if (isDifferentChannel(channel, eventChannel)) return;
      updateMessages([message], false, sdk.currentUser.userId);
    },
    onMessageDeleted(eventChannel, messageId) {
      if (isDifferentChannel(channel, eventChannel)) return;
      deleteMessages([messageId], []);
      deleteNextMessages([messageId], []);
    },
    // Channels
    onChannelChanged: channelUpdater,
    onChannelFrozen: channelUpdater,
    onChannelUnfrozen: channelUpdater,
    onChannelHidden: channelUpdater,
    onChannelMemberCountChanged(channels) {
      const foundChannel = channels.find((c) => !isDifferentChannel(c, channel));
      if (foundChannel) channelUpdater(foundChannel);
    },
    onChannelDeleted(channelUrl: string) {
      if (channel.url === channelUrl) options?.onChannelDeleted?.();
    },
    // Users
    onOperatorUpdated: channelUpdater,
    onUserLeft: channelUpdater,
    // onUserEntered: channelUpdater,
    // onUserExited: channelUpdater,
    onUserJoined: channelUpdater,
    onUserUnbanned: channelUpdater,
    onUserMuted: channelUpdater,
    onUserUnmuted: channelUpdater,
    onUserBanned(eventChannel, bannedUser) {
      if (isDifferentChannel(channel, eventChannel)) return;

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
  }, [channel.url, userId]);

  const refresh: ReturnType<UseGroupChannelMessages>['refresh'] = useFreshCallback(async () => {
    updateRefreshing(true);
    await init(userId);
    updateRefreshing(false);
  });

  const prev: ReturnType<UseGroupChannelMessages>['prev'] = useFreshCallback(async () => {
    if (queryRef.current && queryRef.current?.hasNext) {
      const list = await queryRef.current?.load();
      updateMessages(list, false, sdk.currentUser.userId);
    }
  });

  const next: ReturnType<UseGroupChannelMessages>['next'] = useFreshCallback(async () => {
    if (nextMessages.length > 0) {
      updateMessages(nextMessages, false, sdk.currentUser.userId);
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
              updateNextMessages([pendingMessage], false, sdk.currentUser.userId);
              onPending?.(pendingMessage);
            }
          })
          .onSucceeded((sentMessage) => {
            if (sentMessage.isUserMessage()) {
              updateNextMessages([sentMessage], false, sdk.currentUser.userId);
              resolve(sentMessage);
            }
          })
          .onFailed((err, sentMessage) => {
            updateNextMessages([sentMessage], false, sdk.currentUser.userId);
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
              updateNextMessages([pendingMessage], false, sdk.currentUser.userId);
              onPending?.(pendingMessage);
            }
          })
          .onSucceeded((sentMessage) => {
            if (sentMessage.isFileMessage()) {
              updateNextMessages([sentMessage], false, sdk.currentUser.userId);
              resolve(sentMessage);
            }
          })
          .onFailed((err, sentMessage) => {
            updateNextMessages([sentMessage], false, sdk.currentUser.userId);
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
      const message = await (() => {
        if (failedMessage.isUserMessage()) return channel.resendUserMessage(failedMessage);
        if (failedMessage.isFileMessage()) return channel.resendFileMessage(failedMessage);
        return null;
      })();

      if (message) updateNextMessages([message], false, sdk.currentUser.userId);
    },
  );
  const deleteMessage: ReturnType<UseGroupChannelMessages>['deleteMessage'] = useFreshCallback(async (message) => {
    if (message.sendingStatus === 'succeeded') {
      if (message.isUserMessage()) await channel.deleteMessage(message);
      if (message.isFileMessage()) await channel.deleteMessage(message);
    } else {
      deleteMessages([message.messageId], [message.reqId]);
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
