import { useRef } from 'react';

import type { SendbirdBaseChannel, SendbirdChatSDK, SendbirdOpenChannelListQuery } from '@sendbird/uikit-utils';
import { useAsyncEffect, useFreshCallback } from '@sendbird/uikit-utils';

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
  const queryRef = useRef<SendbirdOpenChannelListQuery>();

  const {
    loading,
    openChannels,
    refreshing,
    updateChannels,
    appendChannels,
    deleteChannels,
    updateRefreshing,
    updateLoading,
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

  useAsyncEffect(async () => {
    updateLoading(true);
    await init(userId);
    updateLoading(false);
  }, [init, userId]);

  const updateChannel = (channel: SendbirdBaseChannel) => {
    if (channel.isOpenChannel()) updateChannels([channel]);
  };

  useChannelHandler(
    sdk,
    HOOK_NAME,
    {
      onChannelChanged: updateChannel,
      onChannelFrozen: updateChannel,
      onChannelUnfrozen: updateChannel,
      onChannelDeleted: (url) => deleteChannels([url]),
      onUserBanned(channel, user) {
        const isMe = user.userId === userId;
        if (isMe && channel.isOpenChannel()) deleteChannels([channel.url]);
      },
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

  const refresh = useFreshCallback(async () => {
    updateRefreshing(true);
    await init(userId);
    updateRefreshing(false);
  });

  const next = useFreshCallback(async () => {
    if (queryRef.current?.hasNext) {
      const channels = await queryRef.current.next();
      appendChannels(channels, false);
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
