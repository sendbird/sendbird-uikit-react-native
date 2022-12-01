import { useEffect, useRef } from 'react';

import { GroupChannelEventSource, GroupChannelFilter, GroupChannelListOrder } from '@sendbird/chat/groupChannel';
import type { SendbirdBaseChannel, SendbirdChatSDK, SendbirdGroupChannelCollection } from '@sendbird/uikit-utils';
import { confirmAndMarkAsDelivered, useAsyncEffect, useFreshCallback, useUniqId } from '@sendbird/uikit-utils';

import { useAppFeatures } from '../../common/useAppFeatures';
import { useChannelHandler } from '../../handler/useChannelHandler';
import type { UseGroupChannelList, UseGroupChannelListOptions } from '../../types';
import { useGroupChannelListReducer } from './reducer';

const HOOK_NAME = 'useGroupChannelListWithCollection';

const createGroupChannelListCollection = (
  sdk: SendbirdChatSDK,
  collectionCreator: UseGroupChannelListOptions['collectionCreator'],
) => {
  const passedCollection = collectionCreator?.();
  if (passedCollection) return passedCollection;

  const filter = new GroupChannelFilter();
  filter.includeEmpty = false;

  return sdk.groupChannel.createGroupChannelCollection({
    filter,
    limit: 20,
    order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
  });
};

export const useGroupChannelListWithCollection: UseGroupChannelList = (sdk, userId, options) => {
  const id = useUniqId(HOOK_NAME);
  const { deliveryReceiptEnabled } = useAppFeatures(sdk);

  const collectionRef = useRef<SendbirdGroupChannelCollection>();

  const { loading, groupChannels, refreshing, setChannels, deleteChannels, updateRefreshing, updateLoading } =
    useGroupChannelListReducer();

  const updateChannelsAndMarkAsDelivered = (
    markAsDelivered: boolean,
    source?: GroupChannelEventSource,
    updatedChannels?: SendbirdBaseChannel[],
  ) => {
    const channels = collectionRef.current?.channels ?? [];
    setChannels(channels, true);
    if (markAsDelivered && deliveryReceiptEnabled) {
      switch (source) {
        case GroupChannelEventSource.EVENT_MESSAGE_RECEIVED:
        case GroupChannelEventSource.EVENT_MESSAGE_SENT:
        case GroupChannelEventSource.SYNC_CHANNEL_BACKGROUND:
        case GroupChannelEventSource.SYNC_CHANNEL_CHANGELOGS:
        case undefined:
          confirmAndMarkAsDelivered(updatedChannels ?? channels);
          break;
      }
    }
  };

  const init = useFreshCallback(async (uid?: string) => {
    if (collectionRef.current) collectionRef.current?.dispose();

    if (uid) {
      collectionRef.current = createGroupChannelListCollection(sdk, options?.collectionCreator);

      collectionRef.current?.setGroupChannelCollectionHandler({
        onChannelsAdded: (context, channels) => {
          updateChannelsAndMarkAsDelivered(true, context.source, channels);
        },
        onChannelsUpdated: (context, channels) => {
          updateChannelsAndMarkAsDelivered(true, context.source, channels);
        },
        onChannelsDeleted: () => {
          updateChannelsAndMarkAsDelivered(false);
        },
      });

      if (collectionRef.current?.hasMore) {
        await collectionRef.current?.loadMore();
        updateChannelsAndMarkAsDelivered(true);
      }
    }
  });

  useEffect(() => {
    return () => {
      if (collectionRef.current) collectionRef.current?.dispose();
    };
  }, []);

  useAsyncEffect(async () => {
    updateLoading(true);
    await init(userId);
    updateLoading(false);
  }, [init, userId]);

  useChannelHandler(sdk, `${HOOK_NAME}_${id}`, {
    onUserBanned: (channel, user) => {
      const isMe = user.userId === userId;
      if (isMe) deleteChannels([channel.url]);
      else updateChannelsAndMarkAsDelivered(false);
    },
  });

  const refresh = useFreshCallback(async () => {
    updateRefreshing(true);
    await init(userId);
    updateRefreshing(false);
  });

  const next = useFreshCallback(async () => {
    if (collectionRef.current?.hasMore) {
      await collectionRef.current?.loadMore();
      updateChannelsAndMarkAsDelivered(true);
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
