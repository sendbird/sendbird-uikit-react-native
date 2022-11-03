import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';

import { UserStruct, useUserList } from '@sendbird/uikit-chat-hooks';
import type { SendbirdUser } from '@sendbird/uikit-utils';

import StatusComposition from '../components/StatusComposition';
import UserSelectableBar from '../components/UserSelectableBar';
import type { GroupChannelInviteFragment } from '../domain/groupChannelUserList/types';
import createUserListModule from '../domain/userList/module/createUserListModule';
import type { UserListModule } from '../domain/userList/types';
import { useLocalization, useSendbirdChat } from '../hooks/useContext';

const createGroupChannelInviteFragment = <UserType extends UserStruct>(
  initModule?: Partial<UserListModule<UserType>>,
): GroupChannelInviteFragment<UserType> => {
  const UserListModule = createUserListModule<UserType>(initModule);

  return ({ channel, onPressHeaderLeft, onInviteMembers, sortComparator, queryCreator, renderUser }) => {
    const { sdk } = useSendbirdChat();
    const { STRINGS } = useLocalization();
    const { users, refreshing, refresh, next, error, loading } = useUserList(sdk, {
      queryCreator,
      sortComparator,
    });

    const _renderUser: NonNullable<typeof renderUser> = useCallback(
      (user, selectedUsers, setSelectedUsers) => {
        if (queryCreator && !renderUser) {
          throw new Error('You should provide "renderUser" when providing "queryCreator"');
        }

        if (renderUser) return renderUser(user, selectedUsers, setSelectedUsers);

        const joinedUserIds = channel.members.map((it) => it.userId);
        const userIdx = selectedUsers.findIndex((it) => it.userId === user.userId);
        const isSelected = userIdx > -1;

        const isAlreadyJoined = joinedUserIds.includes(user.userId);

        return (
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={isAlreadyJoined}
            onPress={() => {
              setSelectedUsers(([...draft]) => {
                if (isSelected) draft.splice(userIdx, 1);
                else draft.push(user);
                return draft;
              });
            }}
          >
            <UserSelectableBar
              uri={(user as unknown as SendbirdUser).profileUrl}
              name={(user as unknown as SendbirdUser).nickname || STRINGS.LABELS.USER_NO_NAME}
              selected={isAlreadyJoined || isSelected}
              disabled={isAlreadyJoined}
            />
          </TouchableOpacity>
        );
      },
      [channel, renderUser, queryCreator],
    );

    return (
      <UserListModule.Provider
        headerRight={(selectedUsers) => STRINGS.GROUP_CHANNEL_INVITE.HEADER_RIGHT({ selectedUsers })}
        headerTitle={STRINGS.GROUP_CHANNEL_INVITE.HEADER_TITLE}
      >
        <UserListModule.Header
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={async (users) => {
            console.log('before', channel.memberCount);
            const userIds = users.map((it) => it.userId);
            const updatedChannel = await channel.inviteWithUserIds(userIds).then((x) => {
              console.log('after', x.memberCount);
              return x;
            });
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
