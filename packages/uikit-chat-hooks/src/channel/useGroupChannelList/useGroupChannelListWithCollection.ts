import { useEffect, useRef } from 'react';

import type { SendbirdChatSDK, SendbirdGroupChannelCollection } from '@sendbird/uikit-utils';
import { useAsyncEffect, useFreshCallback, useUniqId } from '@sendbird/uikit-utils';

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

  const defaultOptions = {
    includeEmpty: false,
    limit: 20,
    order: sdk.GroupChannelCollection.GroupChannelOrder.LATEST_LAST_MESSAGE,
  };
  const collectionBuilder = sdk.GroupChannel.createGroupChannelCollection();
  const groupChannelFilter = new sdk.GroupChannelFilter();
  groupChannelFilter.includeEmpty = defaultOptions.includeEmpty;

  return collectionBuilder
    .setFilter(groupChannelFilter)
    .setLimit(defaultOptions.limit)
    .setOrder(defaultOptions.order)
    .build();
};

export const useGroupChannelListWithCollection: UseGroupChannelList = (sdk, userId, options) => {
  const id = useUniqId(HOOK_NAME);
  const { deliveryReceiptEnabled } = useAppFeatures(sdk);

  const collectionRef = useRef<SendbirdGroupChannelCollection>();

  const { loading, groupChannels, refreshing, setChannels, deleteChannels, updateRefreshing, updateLoading } =
    useGroupChannelListReducer();

  const updateChannelsAndMarkAsDelivered = (markAsDelivered: boolean) => {
    const channels = collectionRef.current?.channelList ?? [];
    setChannels(channels, true);
    if (markAsDelivered && deliveryReceiptEnabled) channels.forEach((channel) => sdk.markAsDelivered(channel.url));
  };

  const init = useFreshCallback(async (uid?: string) => {
    if (collectionRef.current) collectionRef.current?.dispose();

    if (uid) {
      collectionRef.current = createGroupChannelListCollection(sdk, options?.collectionCreator);

      if (collectionRef.current?.hasMore) {
        await collectionRef.current?.loadMore();
        updateChannelsAndMarkAsDelivered(true);
      }

      collectionRef.current?.setGroupChannelCollectionHandler({
        onChannelsAdded() {
          updateChannelsAndMarkAsDelivered(true);
        },
        onChannelsUpdated() {
          updateChannelsAndMarkAsDelivered(true);
        },
        onChannelsDeleted() {
          updateChannelsAndMarkAsDelivered(false);
        },
      });
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
