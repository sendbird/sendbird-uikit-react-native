import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import type Sendbird from 'sendbird';

import { useUserList } from '@sendbird/uikit-chat-hooks';
import type { GroupChannelInviteFragment, UserListModule } from '@sendbird/uikit-react-native-core';
import { createUserListModule, useLocalization, useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { Logger } from '@sendbird/uikit-utils';

import UserSelectableBar from '../ui/UserSelectableBar';

const DefaultUserIdGenerator = <T,>(users: T[]) => {
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
    Header,
    channel,
    onPressHeaderLeft,
    onInviteMembers,
    userIdsGenerator = DefaultUserIdGenerator,
    sortComparator,
    queryCreator,
    renderUser,
    children,
  }) => {
    const { sdk } = useSendbirdChat();
    const { LABEL } = useLocalization();
    const { users, refreshing, refresh, next } = useUserList(sdk, {
      queryCreator,
      sortComparator,
    });

    const _renderUser: NonNullable<typeof renderUser> = useCallback(
      (user, selectedUsers, setSelectedUsers) => {
        if (queryCreator && !renderUser) {
          throw new Error('You should provide "renderUser" when providing "queryCreator"');
        }
        if (renderUser) return renderUser(user, selectedUsers, setSelectedUsers);

        const sbUser = user as unknown as Sendbird.User;
        const sbSelectedUsers = selectedUsers as unknown as Sendbird.User[];
        const sbSetSelectedUsers = setSelectedUsers as unknown as React.Dispatch<React.SetStateAction<Sendbird.User[]>>;

        const joinedUserIds = channel.members.map((u) => u.userId);
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
              name={sbUser.nickname || LABEL.STRINGS.USER_NO_NAME}
              selected={isAlreadyJoined || isSelected}
              disabled={isAlreadyJoined}
            />
          </TouchableOpacity>
        );
      },
      [renderUser, queryCreator],
    );
    return (
      <UserListModule.Provider
        headerRight={(selectedUsers) => LABEL.GROUP_CHANNEL_INVITE.HEADER_RIGHT({ selectedUsers })}
        headerTitle={LABEL.GROUP_CHANNEL_INVITE.HEADER_TITLE}
      >
        <UserListModule.Header
          Header={Header}
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={async (users) => {
            const userIds = userIdsGenerator(users);
            const updatedChannel = await channel.inviteWithUserIds(userIds);
            onInviteMembers(updatedChannel);
          }}
        />
        <UserListModule.List
          onLoadNext={next}
          users={users}
          renderUser={_renderUser}
          onRefresh={refresh}
          refreshing={refreshing}
        />
        {children}
      </UserListModule.Provider>
    );
  };
};

export default createGroupChannelInviteFragment;
