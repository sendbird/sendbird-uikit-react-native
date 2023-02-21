import { useRef } from 'react';

import type { SendbirdBaseChannel, SendbirdOpenChannel, SendbirdPreviousMessageListQuery } from '@sendbird/uikit-utils';
import {
  NOOP,
  isDifferentChannel,
  useAsyncEffect,
  useForceUpdate,
  useFreshCallback,
  useUniqHandlerId,
} from '@sendbird/uikit-utils';

import { useChannelHandler } from '../../handler/useChannelHandler';
import type { UseOpenChannelMessages, UseOpenChannelMessagesOptions } from '../../types';
import { useOpenChannelMessagesReducer } from './reducer';

const createMessageQuery = (channel: SendbirdOpenChannel, creator?: UseOpenChannelMessagesOptions['queryCreator']) => {
  if (creator) return creator();
  return channel.createPreviousMessageListQuery({
    limit: 100,
    reverse: true,
  });
};

export const useOpenChannelMessagesWithQuery: UseOpenChannelMessages = (sdk, channel, userId, options) => {
  const queryRef = useRef<SendbirdPreviousMessageListQuery>();
  const forceUpdate = useForceUpdate();
  const handlerId = useUniqHandlerId('useOpenChannelMessagesWithQuery');

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
  } = useOpenChannelMessagesReducer(userId, options?.sortComparator);

  const init = useFreshCallback(async (uid?: string) => {
    if (uid) {
      queryRef.current = createMessageQuery(channel, options?.queryCreator);
      if (queryRef.current?.hasNext) {
        const list = await queryRef.current?.load();

        updateMessages(list, true, sdk.currentUser.userId);
      }
      updateNextMessages([], true, sdk.currentUser.userId);
    }
  });

  const channelUpdater = (channel: SendbirdBaseChannel) => {
    if (channel.isOpenChannel() && !isDifferentChannel(channel, channel)) {
      forceUpdate();
    }
  };

  useChannelHandler(
    sdk,
    handlerId,
    {
      // Messages
      onMessageReceived(eventChannel, message) {
        if (isDifferentChannel(channel, eventChannel)) return;
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
      onChannelParticipantCountChanged(eventChannel) {
        if (isDifferentChannel(channel, eventChannel)) return;
        channelUpdater(eventChannel);
      },
      onChannelDeleted(channelUrl, type) {
        if (channel.url === channelUrl && type === 'open') {
          options?.onChannelDeleted?.();
        }
      },
      // Users
      onOperatorUpdated: channelUpdater,
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
    },
    'open',
  );

  useAsyncEffect(async () => {
    updateLoading(true);

    try {
      await channel.enter();
      await init(userId);
    } catch (error) {
      options?.onError?.(error);
      options?.onChannelDeleted?.();
    } finally {
      updateLoading(false);
    }

    return () => {
      channel.exit().catch(NOOP);
    };
  }, [init, userId]);

  const refresh: ReturnType<UseOpenChannelMessages>['refresh'] = useFreshCallback(async () => {
    updateRefreshing(true);
    await init(userId);
    updateRefreshing(false);
  });

  const prev: ReturnType<UseOpenChannelMessages>['prev'] = useFreshCallback(async () => {
    if (queryRef.current && queryRef.current?.hasNext) {
      const list = await queryRef.current?.load();
      updateMessages(list, false, sdk.currentUser.userId);
    }
  });

  const next: ReturnType<UseOpenChannelMessages>['next'] = useFreshCallback(async () => {
    if (nextMessages.length > 0) {
      updateMessages(nextMessages, false, sdk.currentUser.userId);
      updateNextMessages([], true, sdk.currentUser.userId);
    }
  });

  const sendUserMessage: ReturnType<UseOpenChannelMessages>['sendUserMessage'] = useFreshCallback(
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

  const sendFileMessage: ReturnType<UseOpenChannelMessages>['sendFileMessage'] = useFreshCallback(
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

  const updateUserMessage: ReturnType<UseOpenChannelMessages>['updateUserMessage'] = useFreshCallback(
    async (messageId, params) => {
      const updatedMessage = await channel.updateUserMessage(messageId, params);
      updateMessages([updatedMessage], false, sdk.currentUser.userId);
      return updatedMessage;
    },
  );
  const updateFileMessage: ReturnType<UseOpenChannelMessages>['updateFileMessage'] = useFreshCallback(
    async (messageId, params) => {
      const updatedMessage = await channel.updateFileMessage(messageId, params);
      updateMessages([updatedMessage], false, sdk.currentUser.userId);
      return updatedMessage;
    },
  );
  const resendMessage: ReturnType<UseOpenChannelMessages>['resendMessage'] = useFreshCallback(async (failedMessage) => {
    const message = await (() => {
      if (failedMessage.isUserMessage()) return channel.resendUserMessage(failedMessage);
      if (failedMessage.isFileMessage()) return channel.resendFileMessage(failedMessage);
      return null;
    })();

    if (message) updateNextMessages([message], false, sdk.currentUser.userId);
  });
  const deleteMessage: ReturnType<UseOpenChannelMessages>['deleteMessage'] = useFreshCallback(async (message) => {
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
