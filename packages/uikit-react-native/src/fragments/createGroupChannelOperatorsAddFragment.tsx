import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';

import { CustomQuery, useUserList } from '@sendbird/uikit-chat-hooks';
import type { SendbirdGroupChannel, SendbirdMember } from '@sendbird/uikit-utils';

import StatusComposition from '../components/StatusComposition';
import UserSelectableBar from '../components/UserSelectableBar';
import type { GroupChannelOperatorsAddFragment } from '../domain/groupChannelUserList/types';
import createUserListModule from '../domain/userList/module/createUserListModule';
import type { UserListModule } from '../domain/userList/types';
import { useLocalization, useSendbirdChat } from '../hooks/useContext';

const createQueryCreator = (channel: SendbirdGroupChannel) => {
  return () => {
    const memberQuery = channel.createMemberListQuery({ limit: 20 });
    return new CustomQuery({
      isLoading: () => {
        return memberQuery.isLoading;
      },
      next: () => {
        return memberQuery.next();
      },
      hasNext: () => {
        return memberQuery.hasNext;
      },
    });
  };
};

const createGroupChannelOperatorsAddFragment = (
  initModule?: Partial<UserListModule<SendbirdMember>>,
): GroupChannelOperatorsAddFragment<SendbirdMember> => {
  const UserListModule = createUserListModule<SendbirdMember>(initModule);

  return ({ channel, onPressHeaderLeft, sortComparator, renderUser, onPressHeaderRight }) => {
    const { sdk, currentUser } = useSendbirdChat();
    const { STRINGS } = useLocalization();
    const { users, refreshing, refresh, next, error, loading } = useUserList(sdk, {
      queryCreator: createQueryCreator(channel),
      sortComparator,
    });

    const _renderUser: NonNullable<typeof renderUser> = useCallback(
      (user, selectedUsers, setSelectedUsers) => {
        if (renderUser) return renderUser(user, selectedUsers, setSelectedUsers);

        const operatorIds = channel.members.filter((it) => it.role === 'operator').map((u) => u.userId);
        const userIdx = selectedUsers.findIndex((u) => u.userId === user.userId);
        const isSelected = userIdx > -1;

        const isOperator = operatorIds.includes(user.userId);

        return (
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={isOperator}
            onPress={() => {
              setSelectedUsers(([...draft]) => {
                if (isSelected) draft.splice(userIdx, 1);
                else draft.push(user);
                return draft;
              });
            }}
          >
            <UserSelectableBar
              uri={user.profileUrl}
              name={
                (user.nickname || STRINGS.LABELS.USER_NO_NAME) +
                (user.userId === currentUser?.userId ? STRINGS.LABELS.USER_BAR_ME_POSTFIX : '')
              }
              selected={isOperator || isSelected}
              disabled={isOperator}
            />
          </TouchableOpacity>
        );
      },
      [channel, renderUser],
    );
    return (
      <UserListModule.Provider
        headerRight={(selectedUsers) => STRINGS.GROUP_CHANNEL_OPERATORS_ADD.HEADER_RIGHT({ selectedUsers })}
        headerTitle={STRINGS.GROUP_CHANNEL_OPERATORS_ADD.HEADER_TITLE}
      >
        <UserListModule.Header
          shouldActivateHeaderRight={(selectedUsers) => selectedUsers.length > 0}
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={async (users) => {
            await channel.addOperators(users.map((it) => it.userId));
            onPressHeaderRight(channel);
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

export default createGroupChannelOperatorsAddFragment;
