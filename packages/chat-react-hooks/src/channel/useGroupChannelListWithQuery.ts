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
  const updateChannels = (channels: SendbirdChannel[], clearPrev: boolean) => {
    const groupChannels = channels.filter((c): c is Sendbird.GroupChannel => c.isGroupChannel());
    if (clearPrev) setGroupChannelMap(arrayToMap(groupChannels, 'url'));
    else setGroupChannelMap((prev) => ({ ...prev, ...arrayToMap(groupChannels, 'url') }));
    groupChannels.forEach((channel) => sdk.markAsDelivered(channel.url));
  };
  const deleteChannels = (channelUrls: string[]) => {
    setGroupChannelMap(({ ...draft }) => {
      channelUrls.forEach((url) => delete draft[url]);
      return draft;
    });
  };
  const init = useCallback(
    async (uid?: string) => {
      if (uid) {
        queryRef.current = createGroupChannelListQuery(sdk, options?.queryCreator);
        if (queryRef.current?.hasNext) {
          const channels = await queryRef.current.next();
          updateChannels(channels, true);
        }
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
