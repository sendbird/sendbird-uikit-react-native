import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';

import { useActiveGroupChannel, useUserList } from '@sendbird/uikit-chat-hooks';
import { Logger, SendbirdUser } from '@sendbird/uikit-utils';

import StatusComposition from '../components/StatusComposition';
import UserSelectableBar from '../components/UserSelectableBar';
import type { GroupChannelInviteFragment } from '../domain/groupChannelUserList/types';
import createUserListModule from '../domain/userList/module/createUserListModule';
import type { UserListModule } from '../domain/userList/types';
import { useLocalization, useSendbirdChat } from '../hooks/useContext';

const defaultUserIdsGenerator = <T,>(users: T[]) => {
  const userIds = users
    .map((user) => {
      // @ts-ignore
      return user.userId as string | undefined;
    })
    .filter((u): u is string => Boolean(u));

  if (userIds.length === 0) {
    Logger.warn(
      'GroupChannelInviteFragment: Couldn\'t find user id to invite! if you provided "queryCreator", please provide "userIdsGenerator" as well',
    );
  }

  return userIds;
};

const createGroupChannelInviteFragment = <UserType,>(
  initModule?: Partial<UserListModule<UserType>>,
): GroupChannelInviteFragment<UserType> => {
  const UserListModule = createUserListModule<UserType>(initModule);

  return ({
    staleChannel,
    onPressHeaderLeft,
    onInviteMembers,
    userIdsGenerator = defaultUserIdsGenerator,
    sortComparator,
    queryCreator,
    renderUser,
  }) => {
    const { sdk } = useSendbirdChat();
    const { STRINGS } = useLocalization();
    const { users, refreshing, refresh, next, error, loading } = useUserList(sdk, {
      queryCreator,
      sortComparator,
    });

    const { activeChannel } = useActiveGroupChannel(sdk, staleChannel);

    const _renderUser: NonNullable<typeof renderUser> = useCallback(
      (user, selectedUsers, setSelectedUsers) => {
        if (queryCreator && !renderUser) {
          throw new Error('You should provide "renderUser" when providing "queryCreator"');
        }
        if (renderUser) return renderUser(user, selectedUsers, setSelectedUsers);

        const sbUser = user as unknown as SendbirdUser;
        const sbSelectedUsers = selectedUsers as unknown as SendbirdUser[];
        const sbSetSelectedUsers = setSelectedUsers as unknown as React.Dispatch<React.SetStateAction<SendbirdUser[]>>;

        const joinedUserIds = activeChannel.members.map((u) => u.userId);
        const userIdx = sbSelectedUsers.findIndex((u) => u.userId === sbUser.userId);
        const isSelected = userIdx > -1;

        const isAlreadyJoined = joinedUserIds.includes(sbUser.userId);

        return (
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={isAlreadyJoined}
            onPress={() => {
              sbSetSelectedUsers(([...draft]) => {
                if (isSelected) draft.splice(userIdx, 1);
                else draft.push(sbUser);
                return draft;
              });
            }}
          >
            <UserSelectableBar
              uri={sbUser.profileUrl}
              name={sbUser.nickname || STRINGS.LABELS.USER_NO_NAME}
              selected={isAlreadyJoined || isSelected}
              disabled={isAlreadyJoined}
            />
          </TouchableOpacity>
        );
      },
      [activeChannel, renderUser, queryCreator],
    );
    return (
      <UserListModule.Provider
        headerRight={(selectedUsers) => STRINGS.GROUP_CHANNEL_INVITE.HEADER_RIGHT({ selectedUsers })}
        headerTitle={STRINGS.GROUP_CHANNEL_INVITE.HEADER_TITLE}
      >
        <UserListModule.Header
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={async (users) => {
            const userIds = userIdsGenerator(users);
            const updatedChannel = await activeChannel.inviteWithUserIds(userIds);
            onInviteMembers(updatedChannel);
          }}
        />
        <StatusComposition
          loading={loading}
          error={Boolean(error)}
          LoadingComponent={<UserListModule.StatusLoading />}
          ErrorComponent={<UserListModule.StatusError onPressRetry={() => refresh()} />}
        >
          <UserListModule.List
            onLoadNext={next}
            users={users}
            renderUser={_renderUser}
            onRefresh={refresh}
            refreshing={refreshing}
            ListEmptyComponent={<UserListModule.StatusEmpty />}
          />
        </StatusComposition>
      </UserListModule.Provider>
    );
  };
};

export default createGroupChannelInviteFragment;
