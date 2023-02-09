import { useRef } from 'react';

import type { SendbirdChannel, SendbirdChatSDK, SendbirdOpenChannelListQuery } from '@sendbird/uikit-utils';
import { confirmAndMarkAsDelivered, useAsyncEffect, useFreshCallback } from '@sendbird/uikit-utils';

import { useAppFeatures } from '../../common/useAppFeatures';
import { useChannelHandler } from '../../handler/useChannelHandler';
import type { UseOpenChannelList, UseOpenChannelListOptions } from '../../types';
import { useOpenChannelListReducer } from './reducer';

const HOOK_NAME = 'useOpenChannelListWithQuery';

const createOpenChannelListQuery = (sdk: SendbirdChatSDK, queryCreator: UseOpenChannelListOptions['queryCreator']) => {
  const passedQuery = queryCreator?.();
  if (passedQuery) return passedQuery;
  return sdk.openChannel.createOpenChannelListQuery({});
};

export const useOpenChannelListWithQuery: UseOpenChannelList = (sdk, userId, options) => {
  const { deliveryReceiptEnabled } = useAppFeatures(sdk);
  const queryRef = useRef<SendbirdOpenChannelListQuery>();

  const {
    loading,
    openChannels,
    refreshing,
    updateChannels,
    setChannels,
    deleteChannels,
    updateRefreshing,
    updateLoading,
  } = useOpenChannelListReducer();

  const updateChannelsAndMarkAsDelivered = (channels: SendbirdChannel[]) => {
    updateChannels(channels);
    if (deliveryReceiptEnabled) confirmAndMarkAsDelivered(channels);
  };

  const init = useFreshCallback(async (uid?: string) => {
    if (uid) {
      queryRef.current = createOpenChannelListQuery(sdk, options?.queryCreator);

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

  useChannelHandler(
    sdk,
    HOOK_NAME,
    {
      onChannelChanged: (channel) => updateChannels([channel]),
      onChannelFrozen: (channel) => updateChannels([channel]),
      onChannelUnfrozen: (channel) => updateChannels([channel]),
      onChannelParticipantCountChanged: (channel) => updateChannels([channel]),
      onChannelDeleted: (url) => deleteChannels([url]),
      onUserBanned(channel, user) {
        const isMe = user.userId === userId;
        if (isMe) deleteChannels([channel.url]);
        else updateChannels([channel]);
      },
      onMessageReceived(channel) {
        updateChannelsAndMarkAsDelivered([channel]);
      },
    },
    'open',
  );

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
    openChannels,
    refresh,
    refreshing,
    next,
  };
};
