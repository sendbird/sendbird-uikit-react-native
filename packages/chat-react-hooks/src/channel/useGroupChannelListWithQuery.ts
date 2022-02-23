import { useCallback, useMemo, useRef, useState } from 'react';
import type Sendbird from 'sendbird';

import type { SendbirdChannel, SendbirdChatSDK } from '@sendbird/uikit-utils';
import { arrayToMap, useAsyncEffect } from '@sendbird/uikit-utils';

import useChannelHandler from '../handler/useChannelHandler';
import type { UseGroupChannelList, UseGroupChannelListOptions } from '../types';

type GroupChannelMap = Record<string, Sendbird.GroupChannel>;

const createGroupChannelListQuery = (
  sdk: SendbirdChatSDK,
  queryCreator: UseGroupChannelListOptions['queryCreator'],
) => {
  const passedQuery = queryCreator?.();
  if (passedQuery) return passedQuery;

  const defaultQuery = sdk.GroupChannel.createMyGroupChannelListQuery();
  defaultQuery.limit = 10;
  defaultQuery.includeEmpty = true;
  defaultQuery.memberStateFilter = 'all';
  defaultQuery.order = 'latest_last_message';
  return defaultQuery;
};

export const useGroupChannelListWithQuery = (
  sdk: SendbirdChatSDK,
  userId?: string,
  options?: UseGroupChannelListOptions,
): UseGroupChannelList => {
  const queryRef = useRef<Sendbird.GroupChannelListQuery>();
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
      clearChannels();
      if (uid) {
        queryRef.current = createGroupChannelListQuery(sdk, options?.queryCreator);
        await next();
      }
    },
    [sdk, options?.queryCreator],
  );
  // ---------- internal methods ends ---------- //

  // ---------- internal hooks ---------- //
  useAsyncEffect(async () => {
    setLoading(true);
    await init(userId);
    setLoading(false);
  }, [init, userId]);

  useChannelHandler(
    sdk,
    'useGroupChannelListWithQuery',
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
    if (queryRef.current?.hasNext) {
      const channels = await queryRef.current.next();
      setGroupChannelMap((prev) => ({ ...prev, ...arrayToMap(channels, 'url') }));
      channels.forEach((channel) => sdk.markAsDelivered(channel.url));
    }
  }, [sdk]);
  // ---------- returns methods ends ---------- //

  return { loading, groupChannels, update, refresh, refreshing, next };
};
