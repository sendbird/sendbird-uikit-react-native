import { useRef } from 'react';

import type { SendbirdBaseChannel, SendbirdChatSDK, SendbirdOpenChannelListQuery } from '@sendbird/uikit-utils';
import { useAsyncEffect, useFreshCallback, useUniqHandlerId } from '@sendbird/uikit-utils';

import { useChannelHandler } from '../../handler/useChannelHandler';
import type { UseOpenChannelList, UseOpenChannelListOptions } from '../../types';
import { useOpenChannelListReducer } from './reducer';

const createOpenChannelListQuery = (sdk: SendbirdChatSDK, queryCreator: UseOpenChannelListOptions['queryCreator']) => {
  const passedQuery = queryCreator?.();
  if (passedQuery) return passedQuery;
  return sdk.openChannel.createOpenChannelListQuery({});
};

export const useOpenChannelListWithQuery: UseOpenChannelList = (sdk, userId, options) => {
  const queryRef = useRef<SendbirdOpenChannelListQuery>();
  const handlerId = useUniqHandlerId('useOpenChannelListWithQuery');

  const {
    error,
    loading,
    openChannels,
    refreshing,
    updateChannels,
    appendChannels,
    deleteChannels,
    updateRefreshing,
    updateLoading,
    updateError,
  } = useOpenChannelListReducer();

  const init = useFreshCallback(async (uid?: string) => {
    if (uid) {
      queryRef.current = createOpenChannelListQuery(sdk, options?.queryCreator);

      if (queryRef.current?.hasNext) {
        const channels = await queryRef.current.next();
        appendChannels(channels, true);
      }
    }
  });

  const updateChannel = (channel: SendbirdBaseChannel) => {
    if (channel.isOpenChannel()) updateChannels([channel]);
  };

  useChannelHandler(
    sdk,
    handlerId,
    {
      onChannelChanged: updateChannel,
      onChannelFrozen: updateChannel,
      onChannelUnfrozen: updateChannel,
      onChannelDeleted: (url) => deleteChannels([url]),
      onUserEntered: (channel, user) => {
        const isMe = user.userId === userId;
        if (isMe && channel.isOpenChannel() && !openChannels.find((it) => it.url === channel.url)) {
          appendChannels([], true);
          refresh();
        }
      },
    },
    'open',
  );

  useAsyncEffect(async () => {
    updateLoading(true);
    updateError(null);
    try {
      await init(userId);
    } catch (e) {
      updateError(e);
      appendChannels([], true);
    } finally {
      updateLoading(false);
    }
  }, [userId]);

  const refresh = useFreshCallback(async () => {
    updateRefreshing(true);
    updateError(null);
    try {
      await init(userId);
    } catch (e) {
      updateError(e);
      appendChannels([], true);
    } finally {
      updateRefreshing(false);
    }
  });

  const next = useFreshCallback(async () => {
    if (queryRef.current?.hasNext) {
      const channels = await queryRef.current.next();
      appendChannels(channels, false);
    }
  });

  return {
    error,
    loading,
    openChannels,
    refresh,
    refreshing,
    next,
  };
};
