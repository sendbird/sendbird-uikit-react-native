import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type Sendbird from 'sendbird';

import type { SendbirdChannel, SendbirdChatSDK } from '@sendbird/uikit-utils';
import { Logger, arrayToMap, useAsyncEffect } from '@sendbird/uikit-utils';

import useInternalPubSub from '../common/useInternalPubSub';
import useChannelHandler from '../handler/useChannelHandler';
import type { UseGroupChannelList, UseGroupChannelListOptions } from '../types';

type GroupChannelMap = Record<string, Sendbird.GroupChannel>;

const createGroupChannelListCollection = (
  sdk: SendbirdChatSDK,
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

const hookName = 'useGroupChannelListWithCollection';

export const useGroupChannelListWithCollection = (
  sdk: SendbirdChatSDK,
  userId?: string,
  options?: UseGroupChannelListOptions,
): UseGroupChannelList => {
  const { events, subscribe } = useInternalPubSub();

  const collectionRef = useRef<Sendbird.GroupChannelCollection>();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [groupChannelMap, setGroupChannelMap] = useState<GroupChannelMap>({});
  const groupChannels = useMemo(() => {
    const channels = Object.values(groupChannelMap);
    if (options?.sortComparator) return channels.sort(options?.sortComparator);
    return channels;
  }, [groupChannelMap, options?.sortComparator]);

  // ---------- internal methods ---------- //
  const updateChannels = (channels: SendbirdChannel[]) => {
    const groupChannels = channels.filter((c): c is Sendbird.GroupChannel => c.isGroupChannel());
    setGroupChannelMap((prev) => ({ ...prev, ...arrayToMap(groupChannels, 'url') }));
    groupChannels.forEach((channel) => sdk.markAsDelivered(channel.url));
  };
  const deleteChannels = (channelUrls: string[]) => {
    setGroupChannelMap(({ ...draft }) => {
      channelUrls.forEach((url) => delete draft[url]);
      return draft;
    });
  };
  const clearChannels = () => {
    setGroupChannelMap({});
  };
  const init = useCallback(
    async (uid?: string) => {
      if (collectionRef.current) collectionRef.current?.dispose();
      clearChannels();

      if (uid) {
        collectionRef.current = createGroupChannelListCollection(sdk, options?.collectionCreator);
        collectionRef.current?.setGroupChannelCollectionHandler({
          onChannelsAdded(_, channels) {
            updateChannels(channels);
          },
          onChannelsUpdated(_, channels) {
            updateChannels(channels);
          },
          onChannelsDeleted(_, channelUrls) {
            deleteChannels(channelUrls);
          },
        });
        updateChannels(await collectionRef.current?.loadMore());
      }
    },
    [sdk, options?.collectionCreator],
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

  useEffect(() => {
    const unsubscribes = [
      subscribe(
        events.ChannelUpdated,
        ({ channel }, err) => {
          if (err) Logger.warn(hookName, 'Cannot update channels', err);
          else updateChannels([channel]);
        },
        hookName,
      ),
      subscribe(
        events.ChannelDeleted,
        ({ channelUrl }, err) => {
          if (err) Logger.warn(hookName, 'Cannot delete channels', err);
          else deleteChannels([channelUrl]);
        },
        hookName,
      ),
    ];

    return () => {
      unsubscribes.forEach((fn) => fn());
    };
  }, []);

  useChannelHandler(
    sdk,
    hookName,
    {
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
    (channel: Sendbird.GroupChannel) => {
      sdk.markAsDelivered(channel.url);
      setGroupChannelMap((prev) => ({ ...prev, [channel.url]: channel }));
    },
    [sdk],
  );

  const next = useCallback(async () => {
    if (collectionRef.current?.hasMore) {
      const channels = await collectionRef.current?.loadMore();
      setGroupChannelMap((prev) => ({ ...prev, ...arrayToMap(channels, 'url') }));
      channels.forEach((channel) => sdk.markAsDelivered(channel.url));
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
