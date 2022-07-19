import { useCallback, useEffect, useRef } from 'react';

import type {
  SendbirdChannel,
  SendbirdChatSDK,
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdMessageCollection,
  SendbirdUserMessage,
} from '@sendbird/uikit-utils';
import { Logger, NOOP, isDifferentChannel, useForceUpdate, useIsMountedRef } from '@sendbird/uikit-utils';

import { useAppFeatures } from '../../common/useAppFeatures';
import { useChannelHandler } from '../../handler/useChannelHandler';
import type { UseGroupChannelMessages, UseGroupChannelMessagesOptions } from '../../types';
import { useActiveGroupChannel } from '../useActiveGroupChannel';
import { useGroupChannelMessagesReducer } from './reducer';

const createMessageCollection = (
  sdk: SendbirdChatSDK,
  channel: SendbirdGroupChannel,
  creator?: UseGroupChannelMessagesOptions['collectionCreator'],
) => {
  if (creator) return creator();
  const collection = channel.createMessageCollection();
  const filter = new sdk.MessageFilter();
  return collection.setLimit(100).setFilter(filter).build();
};

const HOOK_NAME = 'useGroupChannelMessagesWithCollection';

// FIXME: MessageCollection event handler bug, initialize(run async addObserver) -> dispose -> removeObserver -> addObserver called
export const useGroupChannelMessagesWithCollection: UseGroupChannelMessages = (sdk, channel, userId, options) => {
  const isMounted = useIsMountedRef();
  const disposeManuallyAfterUnmounted = () => {
    if (!isMounted.current && collectionRef.current) collectionRef.current.dispose();
  };

  const { deliveryReceiptEnabled } = useAppFeatures(sdk);

  const collectionRef = useRef<SendbirdMessageCollection>();

  // NOTE: We cannot determine the channel object of Sendbird SDK is stale or not, so force update af
  const { activeChannel, setActiveChannel } = useActiveGroupChannel(sdk, channel);
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
      if (deliveryReceiptEnabled) sdk.markAsDelivered(activeChannel.url);
    } catch (e) {
      Logger.error(`[${HOOK_NAME}/channelMarkAs/Delivered]`, e);
    }
    try {
      await sdk.markAsReadWithChannelUrls([activeChannel.url]);
    } catch (e) {
      Logger.error(`[${HOOK_NAME}/channelMarkAs/Read]`, e);
    }
  };

  const updateChannel = (channel: SendbirdChannel) => {
    if (channel.isGroupChannel() && !isDifferentChannel(channel, activeChannel)) {
      setActiveChannel(channel);
      forceUpdate();
    }
  };

  const init = useCallback(
    async (uid?: string, callback?: () => void) => {
      if (collectionRef.current) collectionRef.current?.dispose();

      if (uid) {
        collectionRef.current = createMessageCollection(sdk, activeChannel, options?.collectionCreator);
        updateNextMessages([], true, sdk.currentUser.userId);
        channelMarkAs();

        collectionRef.current
          .initialize(sdk.MessageCollection.MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
          .onCacheResult((err, messages) => {
            if (err) sdk.isCacheEnabled && Logger.error(`[${HOOK_NAME}/onCacheResult]`, err);
            else {
              Logger.debug(`[${HOOK_NAME}/onCacheResult]`, 'message length:', messages.length);
              updateMessages(messages, true, sdk.currentUser.userId);
              updateMessages(collectionRef.current?.pendingMessages ?? [], false, sdk.currentUser.userId);
              updateMessages(collectionRef.current?.failedMessages ?? [], false, sdk.currentUser.userId);
              if (messages?.length) callback?.();
            }
          })
          .onApiResult((err, messages) => {
            if (err) Logger.error(`[${HOOK_NAME}/onApiResult]`, err);
            else {
              Logger.debug(`[${HOOK_NAME}/onApiResult]`, 'message length:', messages.length);
              updateMessages(messages, true, sdk.currentUser.userId);
              if (sdk.isCacheEnabled) {
                updateMessages(collectionRef.current?.pendingMessages ?? [], false, sdk.currentUser.userId);
                updateMessages(collectionRef.current?.failedMessages ?? [], false, sdk.currentUser.userId);
              }
            }
            callback?.();
          });

        collectionRef.current.setMessageCollectionHandler({
          onMessagesAdded(_, channel, messages) {
            disposeManuallyAfterUnmounted();
            channelMarkAs();
            updateNextMessages(messages, false, sdk.currentUser.userId);
            updateChannel(channel);
          },
          onMessagesUpdated(_, channel, messages) {
            disposeManuallyAfterUnmounted();
            updateMessages(messages, false, sdk.currentUser.userId);
            updateChannel(channel);
          },
          onMessagesDeleted(_, channel, messages) {
            disposeManuallyAfterUnmounted();
            const msgIds = messages.map((m) => m.messageId);
            const reqIds = messages
              .filter((m): m is SendbirdUserMessage | SendbirdFileMessage => 'reqId' in m)
              .map((m) => m.reqId);

            deleteMessages(msgIds, reqIds);
            deleteNextMessages(msgIds, reqIds);
            updateChannel(channel);
          },
          onChannelDeleted() {
            disposeManuallyAfterUnmounted();
            options?.onChannelDeleted?.();
          },
          onChannelUpdated(_, channel) {
            disposeManuallyAfterUnmounted();
            updateChannel(channel);
          },
          onHugeGapDetected() {
            disposeManuallyAfterUnmounted();
            init(uid);
          },
        });
      }
    },
    [sdk, activeChannel.url, options?.collectionCreator],
  );

  useChannelHandler(
    sdk,
    HOOK_NAME,
    {
      onUserBanned(channel, bannedUser) {
        disposeManuallyAfterUnmounted();
        if (channel.isGroupChannel() && !isDifferentChannel(channel, activeChannel)) {
          if (bannedUser.userId === sdk.currentUser.userId) {
            options?.onChannelDeleted?.();
          } else {
            setActiveChannel(channel);
            forceUpdate();
          }
        }
      },
    },
    [sdk],
  );

  useEffect(() => {
    // NOTE: Cache read is heavy synchronous task, and it prevents smooth ui transition
    setTimeout(async () => {
      updateLoading(true);
      init(userId, () => updateLoading(false));
    }, 0);
  }, [init, userId]);

  useEffect(() => {
    return () => {
      if (collectionRef.current) collectionRef.current?.dispose();
    };
  }, []);

  const refresh: ReturnType<UseGroupChannelMessages>['refresh'] = useCallback(async () => {
    updateRefreshing(true);
    init(userId, () => updateRefreshing(false));
  }, [init, userId]);

  const prev: ReturnType<UseGroupChannelMessages>['prev'] = useCallback(async () => {
    if (collectionRef.current && collectionRef.current?.hasPrevious) {
      try {
        const list = await collectionRef.current?.loadPrevious();
        updateMessages(list, false, sdk.currentUser.userId);
      } catch {}
    }
  }, []);

  const next: ReturnType<UseGroupChannelMessages>['next'] = useCallback(async () => {
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

  const sendUserMessage: ReturnType<UseGroupChannelMessages>['sendUserMessage'] = useCallback(
    (params, onPending) => {
      return new Promise((resolve, reject) => {
        const pendingMessage = activeChannel.sendUserMessage(params, (sentMessage, error) => {
          if (error) reject(error);
          else {
            updateMessages([sentMessage], false, sdk.currentUser.userId);
            resolve(sentMessage);
          }
        });

        onPending?.(pendingMessage);
        updateMessages([pendingMessage], false, sdk.currentUser.userId);
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
            updateMessages([sentMessage], false, sdk.currentUser.userId);
            resolve(sentMessage as SendbirdFileMessage);
          }
        });

        updateMessages([pendingMessage], false, sdk.currentUser.userId);
        onPending?.(pendingMessage);
      });
    },
    [activeChannel],
  );
  const updateUserMessage: ReturnType<UseGroupChannelMessages>['updateUserMessage'] = useCallback(
    async (messageId, params) => {
      const updatedMessage = await activeChannel.updateUserMessage(messageId, params, NOOP);
      updateMessages([updatedMessage], false, sdk.currentUser.userId);
      return updatedMessage;
    },
    [activeChannel],
  );
  const updateFileMessage: ReturnType<UseGroupChannelMessages>['updateFileMessage'] = useCallback(
    async (messageId, params) => {
      const updatedMessage = await activeChannel.updateFileMessage(messageId, params, NOOP);
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

      if (message) updateMessages([message], false, sdk.currentUser.userId);
    },
    [activeChannel],
  );
  const deleteMessage: ReturnType<UseGroupChannelMessages>['deleteMessage'] = useCallback(
    async (message) => {
      if (message.sendingStatus === 'succeeded') {
        if (message.isUserMessage()) await activeChannel.deleteMessage(message);
        if (message.isFileMessage()) await activeChannel.deleteMessage(message);
      } else {
        try {
          await collectionRef.current?.removeFailedMessages([message]);
        } finally {
          deleteMessages([message.messageId], [message.reqId]);
        }
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
