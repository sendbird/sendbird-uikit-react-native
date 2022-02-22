import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type Sendbird from 'sendbird';

import type { UseGroupChannelList, UseGroupChannelListOptions } from '@sendbird/chat-react-hooks';
import { arrayToMap } from '@sendbird/uikit-utils';

import useChannelHandler from '../handler/useChannelHandler';

type GroupChannelMap = Record<string, Sendbird.GroupChannel>;

const createGroupChannelListCollection = (
  sdk: Sendbird.SendBirdInstance,
  collectionCreator: UseGroupChannelListOptions['collectionCreator'],
) => {
  const passedCollection = collectionCreator?.();
  if (passedCollection) return passedCollection;

  const defaultCollection = sdk.GroupChannel.createGroupChannelCollection();
  const filter = new sdk.GroupChannelFilter();
  filter.includeEmpty = true;
  filter.memberStateFilter = sdk.GroupChannelFilter.MemberStateFilter.ALL;
  return defaultCollection
    .setLimit(10)
    .setFilter(filter)
    .setOrder(sdk.GroupChannelCollection.GroupChannelOrder.LATEST_LAST_MESSAGE)
    .build();
};

export const useGroupChannelListWithCollection = (
  sdk: Sendbird.SendBirdInstance,
  userId?: string,
  options?: UseGroupChannelListOptions,
): UseGroupChannelList => {
  const collectionRef = useRef<Sendbird.GroupChannelCollection>();
  const [groupChannelMap, setGroupChannelMap] = useState<GroupChannelMap>({});
  const [refreshing, setRefreshing] = useState(false);

  const init = useCallback(
    async (uid?: string) => {
      if (uid) {
        if (collectionRef.current) collectionRef.current?.dispose();
        collectionRef.current = createGroupChannelListCollection(sdk, options?.collectionCreator);
        const channels: Sendbird.GroupChannel[] = await collectionRef.current?.loadMore();
        setGroupChannelMap((prev) => ({ ...prev, ...arrayToMap(channels, 'url') }));
        channels.forEach((channel) => sdk.markAsDelivered(channel.url));
      } else {
        setGroupChannelMap({});
      }
    },
    [sdk, options?.queryCreator],
  );

  const updateChannel = (channel: Sendbird.OpenChannel | Sendbird.GroupChannel | Sendbird.BaseChannel) => {
    if (channel.isGroupChannel()) update(channel);
  };
  const deleteChannel = (channelUrl: string) => {
    if (!groupChannelMap[channelUrl]) return;
    setGroupChannelMap((prevState) => {
      delete prevState[channelUrl];
      return { ...prevState };
    });
  };

  useEffect(() => {
    if (!collectionRef.current) return;
    collectionRef.current?.setGroupChannelCollectionHandler({
      onChannelsAdded(_, channels) {
        channels.forEach(updateChannel);
      },
      onChannelsDeleted(_, channelUrls) {
        channelUrls.forEach(deleteChannel);
      },
      onChannelsUpdated(_, channels) {
        channels.forEach(updateChannel);
      },
    });

    return () => {
      if (!collectionRef.current) return;
      collectionRef.current?.dispose();
    };
  }, [collectionRef.current]);

  useChannelHandler(
    sdk,
    'useGroupChannelListWithCollection',
    {
      onUserLeft(channel, user) {
        const isMe = user.userId === sdk.currentUser.userId;
        if (isMe) deleteChannel(channel.url);
        else updateChannel(channel);
      },
      onChannelChanged: updateChannel,
      onChannelFrozen: updateChannel,
      onChannelUnfrozen: updateChannel,
      onChannelDeleted: deleteChannel,
      onChannelMemberCountChanged(channels: Array<Sendbird.GroupChannel>) {
        const validChannels = channels.filter((channel) => channel.isGroupChannel() && groupChannelMap[channel.url]);
        setGroupChannelMap((prevState) => {
          validChannels.forEach((channel) => (prevState[channel.url] = channel));
          return { ...prevState };
        });
      },
    },
    [groupChannelMap],
  );

  useEffect(() => {
    init(userId);
  }, [init, userId]);

  const groupChannels = useMemo(() => {
    const channels = Object.values(groupChannelMap);
    if (options?.sortComparator) return channels.sort(options?.sortComparator);
    return channels;
  }, [groupChannelMap, options?.sortComparator]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await init(userId);
    setRefreshing(false);
  }, [init, userId]);

  const update = useCallback(
    (channel: Sendbird.GroupChannel) => {
      sdk.markAsDelivered(channel.url);
      setGroupChannelMap((prev) => ({ ...prev, [channel.url]: channel }));
    },
    [sdk],
  );

  const loadMore = useCallback(async () => {
    if (collectionRef.current?.hasMore) {
      const channels = await collectionRef.current?.loadMore();
      setGroupChannelMap((prev) => ({ ...prev, ...arrayToMap(channels, 'url') }));
      channels.forEach((channel) => sdk.markAsDelivered(channel.url));
    }
  }, [sdk]);
  return {
    groupChannels,
    refresh,
    refreshing,
    loadMore,
    update,
  };
};
