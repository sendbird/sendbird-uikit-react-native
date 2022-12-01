import { useRef } from 'react';

import { GroupChannelListOrder } from '@sendbird/chat/groupChannel';
import type { SendbirdChannel, SendbirdChatSDK, SendbirdGroupChannelListQuery } from '@sendbird/uikit-utils';
import { confirmAndMarkAsDelivered, useAsyncEffect, useFreshCallback } from '@sendbird/uikit-utils';

import { useAppFeatures } from '../../common/useAppFeatures';
import { useChannelHandler } from '../../handler/useChannelHandler';
import type { UseGroupChannelList, UseGroupChannelListOptions } from '../../types';
import { useGroupChannelListReducer } from './reducer';

const HOOK_NAME = 'useGroupChannelListWithQuery';

const createGroupChannelListQuery = (
  sdk: SendbirdChatSDK,
  queryCreator: UseGroupChannelListOptions['queryCreator'],
) => {
  const passedQuery = queryCreator?.();
  if (passedQuery) return passedQuery;

  return sdk.groupChannel.createMyGroupChannelListQuery({
    includeEmpty: false,
    limit: 20,
    order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
  });
};

export const useGroupChannelListWithQuery: UseGroupChannelList = (sdk, userId, options) => {
  const { deliveryReceiptEnabled } = useAppFeatures(sdk);
  const queryRef = useRef<SendbirdGroupChannelListQuery>();

  const {
    loading,
    groupChannels,
    refreshing,
    updateChannels,
    setChannels,
    deleteChannels,
    updateRefreshing,
    updateLoading,
    updateOrder,
  } = useGroupChannelListReducer();

  const updateChannelsAndMarkAsDelivered = (channels: SendbirdChannel[]) => {
    updateChannels(channels);
    if (deliveryReceiptEnabled) confirmAndMarkAsDelivered(channels);
  };

  const init = useFreshCallback(async (uid?: string) => {
    if (uid) {
      queryRef.current = createGroupChannelListQuery(sdk, options?.queryCreator);
      updateOrder(queryRef.current?.order);

      if (queryRef.current?.hasNext) {
        const channels = await queryRef.current.next();

        setChannels(channels, true);
        if (deliveryReceiptEnabled) confirmAndMarkAsDelivered(channels);
      }
    }
  });

  useAsyncEffect(async () => {
    updateLoading(true);
    await init(userId);
    updateLoading(false);
  }, [init, userId]);

  useChannelHandler(sdk, HOOK_NAME, {
    onChannelChanged: (channel) => updateChannels([channel]),
    onChannelFrozen: (channel) => updateChannels([channel]),
    onChannelUnfrozen: (channel) => updateChannels([channel]),
    onChannelMemberCountChanged: (channels) => updateChannels(channels),
    onChannelDeleted: (url) => deleteChannels([url]),
    onUserJoined: (channel) => updateChannels([channel]),
    onUserLeft: (channel, user) => {
      const isMe = user.userId === userId;
      if (isMe) deleteChannels([channel.url]);
      else updateChannels([channel]);
    },
    onUserBanned(channel, user) {
      const isMe = user.userId === userId;
      if (isMe) deleteChannels([channel.url]);
      else updateChannels([channel]);
    },
    onMessageReceived(channel) {
      updateChannelsAndMarkAsDelivered([channel]);
    },
  });

  const refresh = useFreshCallback(async () => {
    updateRefreshing(true);
    await init(userId);
    updateRefreshing(false);
  });

  const next = useFreshCallback(async () => {
    if (queryRef.current?.hasNext) {
      const channels = await queryRef.current.next();
      setChannels(channels, false);
      if (deliveryReceiptEnabled) confirmAndMarkAsDelivered(channels);
    }
  });

  return {
    loading,
    groupChannels,
    refresh,
    refreshing,
    next,
  };
};
