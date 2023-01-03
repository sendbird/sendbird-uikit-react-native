import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';

import { useUserList } from '@sendbird/uikit-chat-hooks';
import type { SendbirdGroupChannel, SendbirdUser, UserStruct } from '@sendbird/uikit-utils';

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

    const memberIds = shouldFilterMember(channel) ? channel.members.map((it) => it.userId) : [];

    const _renderUser: NonNullable<typeof renderUser> = useCallback(
      (user, selectedUsers, setSelectedUsers) => {
        if (queryCreator && !renderUser) {
          const hasRequiredKey = Object.hasOwn(user, 'profileUrl') && Object.hasOwn(user, 'nickname');
          if (!hasRequiredKey) throw new Error('You should provide "renderUser" when providing "queryCreator"');
        }

        if (renderUser) return renderUser(user, selectedUsers, setSelectedUsers);

        const userIdxInMembers = memberIds.indexOf(user.userId);
        const userIdxInSelectedUsers = selectedUsers.findIndex((it) => it.userId === user.userId);

        const isMember = userIdxInMembers > -1;
        const isSelected = userIdxInSelectedUsers > -1;

        return (
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={isMember}
            onPress={() => {
              setSelectedUsers(([...draft]) => {
                if (isSelected) draft.splice(userIdxInSelectedUsers, 1);
                else draft.push(user);
                return draft;
              });
            }}
          >
            <UserSelectableBar
              uri={(user as unknown as SendbirdUser).profileUrl}
              name={(user as unknown as SendbirdUser).nickname || STRINGS.LABELS.USER_NO_NAME}
              selected={isMember || isSelected}
              disabled={isMember}
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
            const userIds = users.map((it) => it.userId);
            const updatedChannel = await channel.inviteWithUserIds(userIds);
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

function shouldFilterMember(channel: SendbirdGroupChannel) {
  return !channel.isSuper && !channel.isBroadcast;
}

export default createGroupChannelInviteFragment;
