import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type Sendbird from 'sendbird';

import type { GroupChannelListHook } from '../types';
import { arrayToMap } from '../utils';

type GroupChannelMap = Record<string, Sendbird.GroupChannel>;
type Options = {
  comparator: (a: Sendbird.GroupChannel, b: Sendbird.GroupChannel) => number;
  query: Sendbird.GroupChannelListQuery;
};

const createDefaultGroupChannelListQuery = (sdk: Sendbird.SendBirdInstance) => {
  const query = sdk.GroupChannel.createMyGroupChannelListQuery();
  query.memberStateFilter = 'all';
  query.order = 'latest_last_message';
  query.includeEmpty = true;
  query.limit = 10;

  return query;
};

const useGroupChannelList = (
  sdk: Sendbird.SendBirdInstance,
  userId: string,
  options?: Options,
): GroupChannelListHook => {
  const queryRef = useRef(options?.query);
  const [groupChannelMap, setGroupChannelMap] = useState<GroupChannelMap>({});

  const init = useCallback(
    async (uid: string) => {
      if (uid) {
        let groupQuery = options?.query;
        if (!groupQuery) groupQuery = createDefaultGroupChannelListQuery(sdk);
        queryRef.current = groupQuery;

        const channels = await groupQuery.next();
        setGroupChannelMap((prev) => ({
          ...prev,
          ...arrayToMap(channels, 'url'),
        }));
        channels.forEach((channel) => sdk.markAsDelivered(channel.url));
      } else {
        setGroupChannelMap({});
      }
    },
    [sdk, options?.query],
  );

  useEffect(() => {
    init(userId);
  }, [init, userId]);

  const groupChannels = useMemo(
    () => Object.values(groupChannelMap).sort(options?.comparator),
    [groupChannelMap, options?.comparator],
  );

  const refresh = useCallback(() => init(userId), [init, userId]);

  const update = useCallback(
    (channel: Sendbird.GroupChannel) => {
      sdk.markAsDelivered(channel.url);
      setGroupChannelMap((prev) => ({ ...prev, [channel.url]: channel }));
    },
    [sdk],
  );

  const loadPrev = useCallback(async () => {
    if (queryRef.current?.hasNext) {
      const channels = await queryRef.current.next();
      setGroupChannelMap((prev) => ({
        ...prev,
        ...arrayToMap(channels, 'url'),
      }));
      channels.forEach((channel) => sdk.markAsDelivered(channel.url));
    }
  }, [sdk]);
  return { groupChannels, update, refresh, loadPrev };
};

export default useGroupChannelList;
