import { useRef } from 'react';

import type { BaseMessage, PreviousMessageListQueryParams } from '@sendbird/chat/message';
import type {
  SendbirdBaseChannel,
  SendbirdGroupChannel,
  SendbirdPreviousMessageListQuery,
} from '@sendbird/uikit-utils';
import {
  ASYNC_NOOP,
  Logger,
  confirmAndMarkAsRead,
  isDifferentChannel,
  isMyMessage,
  useAsyncEffect,
  useForceUpdate,
  useFreshCallback,
  useUniqHandlerId,
} from '@sendbird/uikit-utils';

import { useChannelHandler } from '../../handler/useChannelHandler';
import type { UseGroupChannelMessages, UseGroupChannelMessagesOptions } from '../../types';
import { useChannelMessagesReducer } from '../useChannelMessagesReducer';

const createMessageQuery = (channel: SendbirdGroupChannel, options?: UseGroupChannelMessagesOptions) => {
  if (options?.queryCreator) return options.queryCreator();

  const params: PreviousMessageListQueryParams = { limit: 100, reverse: true };
  if (options?.replyType) params.replyType = options.replyType;

  return channel.createPreviousMessageListQuery(params);
};

export const useGroupChannelMessagesWithQuery: UseGroupChannelMessages = (sdk, channel, userId, options) => {
  const queryRef = useRef<SendbirdPreviousMessageListQuery>();
  const handlerId = useUniqHandlerId('useGroupChannelMessagesWithQuery');

  const forceUpdate = useForceUpdate();

  const {
    loading,
    refreshing,
    messages,
    newMessages,
    updateMessages,
    deleteMessages,
    updateNewMessages,
    deleteNewMessages,
    updateLoading,
    updateRefreshing,
  } = useChannelMessagesReducer(options?.sortComparator);

  const channelMarkAsRead = async () => {
    try {
      await confirmAndMarkAsRead([channel]);
    } catch (e) {
      Logger.warn('[useGroupChannelMessagesWithQuery/channelMarkAsRead]', e);
    }
  };

  const init = useFreshCallback(async (uid?: string) => {
    if (uid) {
      channelMarkAsRead();
      updateNewMessages([], true, sdk.currentUser?.userId);

      queryRef.current = createMessageQuery(channel, options);
      if (queryRef.current?.hasNext) {
        const list = await queryRef.current?.load();
        updateMessages(list, true, sdk.currentUser?.userId);
      }
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
      if (isMyMessage(message, sdk.currentUser?.userId)) return;

      channelMarkAsRead();

      updateMessages([message], false, sdk.currentUser?.userId);
      if (options?.shouldCountNewMessages?.()) {
        updateNewMessages([message], false, sdk.currentUser?.userId);
      }
      if (options?.onMessagesReceived) {
        options.onMessagesReceived([message]);
      }
    },
    onMessageUpdated(eventChannel, message) {
      if (isDifferentChannel(channel, eventChannel)) return;
      if (isMyMessage(message, sdk.currentUser?.userId)) return;

      updateMessages([message], false, sdk.currentUser?.userId);
    },
    onMessageDeleted(eventChannel, messageId) {
      if (isDifferentChannel(channel, eventChannel)) return;
      deleteMessages([messageId], []);
      deleteNewMessages([messageId], []);
    },
    async onReactionUpdated(eventChannel, reactionEvent) {
      if (isDifferentChannel(channel, eventChannel)) return;

      const message = await sdk.message.getMessage({
        messageId: reactionEvent.messageId,
        includeReactions: true,
        includeParentMessageInfo: true,
        includeThreadInfo: true,
        includeMetaArray: true,
        channelUrl: channel.url,
        channelType: channel.channelType,
      });
      if (message) updateMessages([message as BaseMessage], false, sdk.currentUser?.userId);
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

      if (bannedUser.userId === sdk.currentUser?.userId) {
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
      updateMessages(list, false, sdk.currentUser?.userId);
    }
  });
  const hasPrev: ReturnType<UseGroupChannelMessages>['hasPrev'] = useFreshCallback(
    () => queryRef.current?.hasNext ?? false,
  );

  const next: ReturnType<UseGroupChannelMessages>['next'] = useFreshCallback(ASYNC_NOOP);
  const hasNext: ReturnType<UseGroupChannelMessages>['hasNext'] = useFreshCallback(() => false);

  const sendUserMessage: ReturnType<UseGroupChannelMessages>['sendUserMessage'] = useFreshCallback(
    (params, onPending) => {
      return new Promise((resolve, reject) => {
        channel
          .sendUserMessage(params)
          .onPending((pendingMessage) => {
            if (pendingMessage.isUserMessage()) {
              updateMessages([pendingMessage], false, sdk.currentUser?.userId);
              onPending?.(pendingMessage);
            }
          })
          .onSucceeded((sentMessage) => {
            if (sentMessage.isUserMessage()) {
              updateMessages([sentMessage], false, sdk.currentUser?.userId);
              resolve(sentMessage);
            }
          })
          .onFailed((err, failedMessage) => {
            if (failedMessage) {
              updateMessages([failedMessage], false, sdk.currentUser?.userId);
            }
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
              updateMessages([pendingMessage], false, sdk.currentUser?.userId);
              onPending?.(pendingMessage);
            }
          })
          .onSucceeded((sentMessage) => {
            if (sentMessage.isFileMessage()) {
              updateMessages([sentMessage], false, sdk.currentUser?.userId);
              resolve(sentMessage);
            }
          })
          .onFailed((err, failedMessage) => {
            if (failedMessage) {
              updateMessages([failedMessage], false, sdk.currentUser?.userId);
            }
            reject(err);
          });
      });
    },
  );
  const updateUserMessage: ReturnType<UseGroupChannelMessages>['updateUserMessage'] = useFreshCallback(
    async (messageId, params) => {
      const updatedMessage = await channel.updateUserMessage(messageId, params);
      updateMessages([updatedMessage], false, sdk.currentUser?.userId);
      return updatedMessage;
    },
  );
  const updateFileMessage: ReturnType<UseGroupChannelMessages>['updateFileMessage'] = useFreshCallback(
    async (messageId, params) => {
      const updatedMessage = await channel.updateFileMessage(messageId, params);
      updateMessages([updatedMessage], false, sdk.currentUser?.userId);
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

      if (message) updateMessages([message], false, sdk.currentUser?.userId);
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
  const resetNewMessages: ReturnType<UseGroupChannelMessages>['resetNewMessages'] = useFreshCallback(() => {
    updateNewMessages([], true, sdk.currentUser?.userId);
  });

  return {
    loading,
    refreshing,
    refresh,
    messages,
    newMessages,
    resetNewMessages,
    next,
    hasNext,
    prev,
    hasPrev,
    sendUserMessage,
    sendFileMessage,
    updateUserMessage,
    updateFileMessage,
    resendMessage,
    deleteMessage,
    resetWithStartingPoint() {
      Logger.warn('resetWithStartingPoint is not supported in Query, please use Collection instead.');
    },
  };
};
