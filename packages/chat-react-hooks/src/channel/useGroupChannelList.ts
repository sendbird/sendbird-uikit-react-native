import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type Sendbird from 'sendbird';

import { arrayToMap } from '@sendbird/uikit-utils';

import useChannelHandler from '../handler/useChannelHandler';
import type { GroupChannelListHook } from '../types';

type GroupChannelMap = Record<string, Sendbird.GroupChannel>;
type Options = {
  comparator?: (a: Sendbird.GroupChannel, b: Sendbird.GroupChannel) => number;
  query?: Partial<{
    userIdsExactFilter: Array<string>;
    userIdsIncludeFilter: Array<string>;
    userIdsIncludeFilterQueryType: 'AND' | 'OR';
    nicknameContainsFilter: string;
    channelNameContainsFilter: string;
    customTypeFilter: string;
    customTypesFilter: Array<string>;
    customTypeStartsWithFilter: string;
    channelUrlsFilter: Array<string>;
    superChannelFilter: 'all' | 'super' | 'nonsuper' | 'broadcast_only';
    publicChannelFilter: 'all' | 'public' | 'private';
    metadataOrderKeyFilter: string;
    metadataKey: string;
    metadataValues: Array<string>;
    metadataValueStartsWith: string;
    memberStateFilter: 'all' | 'joined_only' | 'invited_only' | 'invited_by_friend' | 'invited_by_non_friend';
    hiddenChannelFilter: 'unhidden_only' | 'hidden_only' | 'hidden_allow_auto_unhide' | 'hidden_prevent_auto_unhide';
    unreadChannelFilter: 'all' | 'unread_message';
    includeFrozen: boolean;
    includeEmpty: boolean;
    order: 'latest_last_message' | 'chronological' | 'channel_name_alphabetical' | 'metadata_value_alphabetical';
    limit: number;
  }>;
};

const createGroupChannelListQuery = (sdk: Sendbird.SendBirdInstance, queryOption?: Options['query']) => {
  const query = sdk.GroupChannel.createMyGroupChannelListQuery();

  if (queryOption) {
    //@ts-ignore
    Object.entries(queryOption).forEach(([key, val]) => (query[key] = val));
  } else {
    query.memberStateFilter = 'all';
    query.order = 'latest_last_message';
    query.includeEmpty = true;
    query.limit = 10;
  }

  return query;
};

const useGroupChannelList = (
  sdk: Sendbird.SendBirdInstance,
  userId?: string,
  options?: Options,
): GroupChannelListHook => {
  const queryRef = useRef<Sendbird.GroupChannelListQuery>();
  const [groupChannelMap, setGroupChannelMap] = useState<GroupChannelMap>({});
  const [refreshing, setRefreshing] = useState(false);

  const init = useCallback(
    async (uid?: string) => {
      if (uid) {
        queryRef.current = createGroupChannelListQuery(sdk, options?.query);

        const channels: Sendbird.GroupChannel[] = await queryRef.current.next();
        setGroupChannelMap((prev) => ({ ...prev, ...arrayToMap(channels, 'url') }));
        channels.forEach((channel) => sdk.markAsDelivered(channel.url));
      } else {
        setGroupChannelMap({});
      }
    },
    [sdk, options?.query],
  );

  const isTargetChannel = (
    channelOrChannelUrl: Sendbird.OpenChannel | Sendbird.GroupChannel | string,
  ): channelOrChannelUrl is Sendbird.GroupChannel => {
    if (typeof channelOrChannelUrl === 'string') return Boolean(groupChannelMap[channelOrChannelUrl]);
    return channelOrChannelUrl.isGroupChannel() && Boolean(groupChannelMap[channelOrChannelUrl.url]);
  };

  const replaceChannel = (channel: Sendbird.OpenChannel | Sendbird.GroupChannel) => {
    if (!isTargetChannel(channel)) return;
    setGroupChannelMap((prevState) => {
      prevState[channel.url] = channel;
      return { ...prevState };
    });
  };

  useChannelHandler(sdk, 'useGroupChannelList', {
    onChannelChanged: replaceChannel,
    onChannelFrozen: replaceChannel,
    onChannelUnfrozen: replaceChannel,
    onChannelDeleted(channelUrl: string) {
      if (!groupChannelMap[channelUrl]) return;
      setGroupChannelMap((prevState) => {
        delete prevState[channelUrl];
        return { ...prevState };
      });
    },
    onChannelMemberCountChanged(channels: Array<Sendbird.GroupChannel>) {
      const validChannels = channels.filter(isTargetChannel);
      setGroupChannelMap((prevState) => {
        validChannels.forEach((channel) => (prevState[channel.url] = channel));
        return { ...prevState };
      });
    },
  });

  useEffect(() => {
    init(userId);
  }, [init, userId]);

  const groupChannels = useMemo(
    () => Object.values(groupChannelMap).sort(options?.comparator),
    [groupChannelMap, options?.comparator],
  );

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
