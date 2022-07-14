import { useCallback, useMemo, useRef, useState } from 'react';

import { Optional, SendbirdChatSDK, SendbirdUser, useAsyncEffect } from '@sendbird/uikit-utils';

import type { CustomQueryInterface, UseUserList, UseUserListOptions } from '../types';

const createUserQuery = <User>(sdk: SendbirdChatSDK, queryCreator?: UseUserListOptions<User>['queryCreator']) => {
  if (queryCreator) return queryCreator();
  return sdk.createApplicationUserListQuery() as unknown as CustomQueryInterface<User>;
};

/**
 * Get user list from query.
 * default query uses 'instance.createApplicationUserListQuery'
 * The response type of hook is depends on return type of 'query.next()'
 *
 * You can call hook with your custom query using {@link CustomQuery}
 * Or you can create your 'CustomQueryClass' implemented {@link CustomQueryInterface}'
 *
 * ```example
 *  const { users } = useUserList(sdk, {
 *    queryCreator: () => {
 *      const friendQuery = sdk.createFriendListQuery();
 *      return new CustomQuery({
 *        next: () => friendQuery.next(),
 *        isLoading: () => friendQuery.isLoading,
 *        hasNext: () => friendQuery.hasMore,
 *      });
 *    }
 *  })
 * ```
 * */
export const useUserList = <
  Options extends UseUserListOptions<QueriedUser>,
  QueriedUser = Options['queryCreator'] extends Optional<() => CustomQueryInterface<infer User>> ? User : SendbirdUser,
>(
  sdk: SendbirdChatSDK,
  options?: Options,
): UseUserList<QueriedUser> => {
  const query = useRef<CustomQueryInterface<QueriedUser>>();

  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [users, setUsers] = useState<QueriedUser[]>([]);
  const sortedUsers = useMemo((): QueriedUser[] => {
    if (options?.sortComparator) return users.sort(options.sortComparator);
    return users;
  }, [users, options?.sortComparator]);

  const updateUsers = (users: QueriedUser[], clearPrev: boolean) => {
    if (clearPrev) setUsers(users);
    else setUsers((prev) => prev.concat(users));
  };

  const init = useCallback(async () => {
    query.current = createUserQuery<QueriedUser>(sdk, options?.queryCreator);
    if (query.current?.hasNext) {
      const users = await query.current?.next();
      updateUsers(users, true);
    }
  }, [sdk, options?.queryCreator]);

  useAsyncEffect(async () => {
    setLoading(true);
    setError(null);
    try {
      await init();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [init]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      await init();
    } catch (e) {
      setError(e);
    } finally {
      setRefreshing(false);
    }
  }, [init]);

  const next = useCallback(async () => {
    if (query.current && query.current?.hasNext) {
      updateUsers(await query.current?.next(), false);
    }
  }, []);

  return {
    loading,
    error,
    users: sortedUsers,
    next,
    refreshing,
    refresh,
  };
};
