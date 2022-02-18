import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type Sendbird from 'sendbird';

import { arrayToMap } from '@sendbird/uikit-utils';

import useChannelHandler from '../handler/useChannelHandler';
import type { UseGroupChannelList, UseGroupChannelListOptions } from '../types';

type GroupChannelMap = Record<string, Sendbird.GroupChannel>;

const createGroupChannelListQuery = (
  sdk: Sendbird.SendBirdInstance,
  queryCreator: UseGroupChannelListOptions['queryFactory'],
) => {
  const passedQuery = queryCreator?.();
  if (passedQuery) return passedQuery;

  const defaultQuery = sdk.GroupChannel.createMyGroupChannelListQuery();
  defaultQuery.memberStateFilter = 'all';
  defaultQuery.order = 'latest_last_message';
  defaultQuery.includeEmpty = true;
  defaultQuery.limit = 10;
  return defaultQuery;
};

const useGroupChannelList = (
  sdk: Sendbird.SendBirdInstance,
  userId?: string,
  options?: UseGroupChannelListOptions,
): UseGroupChannelList => {
  const queryRef = useRef<Sendbird.GroupChannelListQuery>();
  const [groupChannelMap, setGroupChannelMap] = useState<GroupChannelMap>({});
  const [refreshing, setRefreshing] = useState(false);

  const init = useCallback(
    async (uid?: string) => {
      if (uid) {
        queryRef.current = createGroupChannelListQuery(sdk, options?.queryFactory);

        const channels: Sendbird.GroupChannel[] = await queryRef.current.next();
        setGroupChannelMap((prev) => ({ ...prev, ...arrayToMap(channels, 'url') }));
        channels.forEach((channel) => sdk.markAsDelivered(channel.url));
      } else {
        setGroupChannelMap({});
      }
    },
    [sdk, options?.queryFactory],
  );

  const updateChannel = (channel: Sendbird.OpenChannel | Sendbird.GroupChannel) => {
    if (channel.isGroupChannel()) update(channel);
  };

  useChannelHandler(
    sdk,
    'useGroupChannelList',
    {
      onChannelChanged: updateChannel,
      onChannelFrozen: updateChannel,
      onChannelUnfrozen: updateChannel,
      onChannelDeleted(channelUrl: string) {
        if (!groupChannelMap[channelUrl]) return;
        setGroupChannelMap((prevState) => {
          delete prevState[channelUrl];
          return { ...prevState };
        });
      },
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
    if (options?.queryFactory) return channels.sort(options?.sortComparator);
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
    if (queryRef.current?.hasNext) {
      const channels = await queryRef.current.next();
      setGroupChannelMap((prev) => ({ ...prev, ...arrayToMap(channels, 'url') }));
      channels.forEach((channel) => sdk.markAsDelivered(channel.url));
    }
  }, [sdk]);

  return { groupChannels, update, refresh, refreshing, loadMore };
};

export default useGroupChannelList;
