import { useMemo, useRef, useState } from 'react';

import type { Optional, SendbirdChatSDK, SendbirdUser, UserStruct } from '@sendbird/uikit-utils';
import { Logger, SBErrorCode, SBErrorMessage, useAsyncEffect, useFreshCallback } from '@sendbird/uikit-utils';

import type { CustomQueryInterface, UseUserListOptions, UseUserListReturn } from '../types';

const createUserQuery = <User extends UserStruct>(
  sdk: SendbirdChatSDK,
  queryCreator?: UseUserListOptions<User>['queryCreator'],
) => {
  if (queryCreator) return queryCreator();
  // In order to use the API, the option must be turned on in the dashboard.
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
  QueriedUser extends UserStruct = Options['queryCreator'] extends Optional<
    () => CustomQueryInterface<infer User extends UserStruct>
  >
    ? User
    : SendbirdUser,
>(
  sdk: SendbirdChatSDK,
  options?: Options,
): UseUserListReturn<QueriedUser> => {
  const query = useRef<CustomQueryInterface<QueriedUser>>();

  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [users, setUsers] = useState<QueriedUser[]>([]);
  const sortedUsers = useMemo((): QueriedUser[] => {
    if (options?.sortComparator) return users.sort(options.sortComparator);
    return users;
  }, [users, options?.sortComparator]);

  const upsertUser = useFreshCallback((user: QueriedUser) => {
    setUsers(([...draft]) => {
      const userIdx = draft.findIndex((it) => it.userId === user.userId);
      if (userIdx > -1) draft[userIdx] = user;
      else draft.push(user);
      return draft;
    });
  });

  const deleteUser = useFreshCallback((userId: QueriedUser['userId']) => {
    setUsers(([...draft]) => {
      const userIdx = draft.findIndex((it) => it.userId === userId);
      if (userIdx > -1) draft.splice(userIdx, 1);
      return draft;
    });
  });

  const updateUsers = (users: QueriedUser[], clearPrev: boolean) => {
    if (clearPrev) setUsers(users);
    else setUsers((prev) => prev.concat(users));
  };

  const init = useFreshCallback(async () => {
    query.current = createUserQuery<QueriedUser>(sdk, options?.queryCreator);
    if (query.current?.hasNext) {
      const users = await query.current?.next().catch((e) => {
        Logger.error(e);
        if (e.code === SBErrorCode.NON_AUTHORIZED) Logger.warn(SBErrorMessage.ACL);
        throw e;
      });
      updateUsers(users, true);
    }
  });

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
  }, []);

  const refresh = useFreshCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      await init();
    } catch (e) {
      setError(e);
    } finally {
      setRefreshing(false);
    }
  });

  const next = useFreshCallback(async () => {
    if (query.current && query.current?.hasNext) {
      const nextUsers = await query.current.next().catch((e) => {
        Logger.error(e);
        if (e.code === SBErrorCode.NON_AUTHORIZED) Logger.warn(SBErrorMessage.ACL);
        throw e;
      });
      updateUsers(nextUsers, false);
    }
  });

  return {
    loading,
    error,
    users: sortedUsers,
    upsertUser,
    deleteUser,
    next,
    refreshing,
    refresh,
  };
};
