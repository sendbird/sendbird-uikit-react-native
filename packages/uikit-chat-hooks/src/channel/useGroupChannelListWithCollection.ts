import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type {
  SendbirdChannel,
  SendbirdChatSDK,
  SendbirdGroupChannel,
  SendbirdGroupChannelCollection,
} from '@sendbird/uikit-utils';
import { arrayToMap, useAsyncEffect, useUniqId } from '@sendbird/uikit-utils';

import { useAppFeatures } from '../common/useAppFeatures';
import { useChannelHandler } from '../handler/useChannelHandler';
import type { UseGroupChannelList, UseGroupChannelListOptions } from '../types';

type GroupChannelMap = Record<string, SendbirdGroupChannel>;

const HOOK_NAME = 'useGroupChannelListWithCollection';
const createGroupChannelListCollection = (
  sdk: SendbirdChatSDK,
  collectionCreator: UseGroupChannelListOptions['collectionCreator'],
) => {
  const passedCollection = collectionCreator?.();
  if (passedCollection) return passedCollection;

  const defaultCollection = sdk.GroupChannel.createGroupChannelCollection();
  const filter = new sdk.GroupChannelFilter();
  return defaultCollection.setLimit(20).setFilter(filter).build();
};

export const useGroupChannelListWithCollection: UseGroupChannelList = (sdk, userId, options) => {
  const id = useUniqId(HOOK_NAME);
  const { deliveryReceiptEnabled } = useAppFeatures(sdk);

  const collectionRef = useRef<SendbirdGroupChannelCollection>();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [groupChannelMap, setGroupChannelMap] = useState<GroupChannelMap>({});
  const groupChannels = useMemo(() => {
    const channels = Object.values(groupChannelMap);
    if (options?.sortComparator) return channels.sort(options?.sortComparator);
    return channels;
  }, [groupChannelMap, options?.sortComparator]);

  // ---------- internal methods ---------- //
  const updateChannels = (channels: SendbirdChannel[], clearPrev: boolean) => {
    const groupChannels = channels.filter((c): c is SendbirdGroupChannel => c.isGroupChannel());
    if (clearPrev) setGroupChannelMap(arrayToMap(groupChannels, 'url'));
    else setGroupChannelMap((prev) => ({ ...prev, ...arrayToMap(groupChannels, 'url') }));
    if (deliveryReceiptEnabled) groupChannels.forEach((channel) => sdk.markAsDelivered(channel.url));
  };
  const deleteChannels = (channelUrls: string[]) => {
    setGroupChannelMap(({ ...draft }) => {
      channelUrls.forEach((url) => delete draft[url]);
      return draft;
    });
  };
  const init = useCallback(
    async (uid?: string) => {
      if (collectionRef.current) collectionRef.current?.dispose();

      if (uid) {
        collectionRef.current = createGroupChannelListCollection(sdk, options?.collectionCreator);
        if (collectionRef.current?.hasMore) {
          updateChannels(await collectionRef.current?.loadMore(), true);
        }

        collectionRef.current?.setGroupChannelCollectionHandler({
          onChannelsAdded(_, channels) {
            updateChannels(channels, false);
          },
          onChannelsUpdated(_, channels) {
            updateChannels(channels, false);
          },
          onChannelsDeleted(_, channelUrls) {
            deleteChannels(channelUrls);
          },
        });
      }
    },
    [sdk, options?.collectionCreator],
  );

  useChannelHandler(
    sdk,
    HOOK_NAME,
    {
      onUserLeft(channel, user) {
        const isMe = user.userId === userId;
        if (isMe) deleteChannels([channel.url]);
        else updateChannels([channel], false);
      },
      onUserBanned(channel, user) {
        const isMe = user.userId === userId;
        if (isMe) deleteChannels([channel.url]);
        else updateChannels([channel], false);
      },
    },
    [sdk, userId],
  );
  // ---------- internal methods ends ---------- //

  // ---------- internal hooks ---------- //
  useEffect(() => {
    return () => {
      if (collectionRef.current) collectionRef.current?.dispose();
    };
  }, []);
  useAsyncEffect(async () => {
    setLoading(true);
    await init(userId);
    setLoading(false);
  }, [init, userId]);

  useChannelHandler(
    sdk,
    `${HOOK_NAME}_${id}`,
    {
      onChannelChanged: (channel) => updateChannels([channel], false),
      onChannelFrozen: (channel) => updateChannels([channel], false),
      onChannelUnfrozen: (channel) => updateChannels([channel], false),
      onChannelMemberCountChanged: (channels) => updateChannels(channels, false),
      onChannelDeleted: (url) => deleteChannels([url]),
      onUserJoined: (channel) => updateChannels([channel], false),
      onUserLeft: (channel, user) => {
        const isMe = user.userId === userId;
        if (isMe) deleteChannels([channel.url]);
        else updateChannels([channel], false);
      },
      onUserBanned: (channel, user) => {
        const isMe = user.userId === userId;
        if (isMe) deleteChannels([channel.url]);
        else updateChannels([channel], false);
      },
    },
    [sdk, userId],
  );
  // ---------- internal hooks ends ---------- //

  // ---------- returns methods ---------- //
  const refresh = useCallback(async () => {
    setRefreshing(true);
    await init(userId);
    setRefreshing(false);
  }, [init, userId]);

  const update = useCallback(
    (channel: SendbirdGroupChannel) => {
      if (deliveryReceiptEnabled) sdk.markAsDelivered(channel.url);
      setGroupChannelMap((prev) => ({ ...prev, [channel.url]: channel }));
    },
    [sdk],
  );

  const next = useCallback(async () => {
    if (collectionRef.current?.hasMore) {
      const channels = await collectionRef.current?.loadMore();
      setGroupChannelMap((prev) => ({ ...prev, ...arrayToMap(channels, 'url') }));
      if (deliveryReceiptEnabled) channels.forEach((channel) => sdk.markAsDelivered(channel.url));
    }
  }, [sdk]);
  // ---------- returns methods ends ---------- //

  return {
    loading,
    groupChannels,
    refresh,
    refreshing,
    next,
    update,
  };
};
