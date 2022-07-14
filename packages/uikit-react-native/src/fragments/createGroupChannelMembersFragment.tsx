import React, { useCallback } from 'react';

import { CustomQuery, useUserList } from '@sendbird/uikit-chat-hooks';
import type { GroupChannelMembersFragment, UserListModule } from '@sendbird/uikit-react-native-core';
import {
  StatusComposition,
  createUserListModule,
  useLocalization,
  useSendbirdChat,
} from '@sendbird/uikit-react-native-core';
import { Icon } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdGroupChannel, SendbirdMember } from '@sendbird/uikit-utils';

import UserActionBar from '../ui/UserActionBar';

const noop = () => '';
const createMemberListQuery = (channel: SendbirdGroupChannel) => {
  const query = channel.createMemberListQuery();
  query.limit = 50;
  query.order = 'operator_then_member_alphabetical';
  return new CustomQuery({
    hasNext(): boolean {
      return query.hasNext;
    },
    isLoading(): boolean {
      return query.isLoading;
    },
    next() {
      return query.next();
    },
  });
};

const createGroupChannelMembersFragment = (
  initModule?: Partial<UserListModule<SendbirdMember>>,
): GroupChannelMembersFragment<SendbirdMember> => {
  const UserListModule = createUserListModule<SendbirdMember>(initModule);

  return ({ staleChannel, onPressHeaderLeft, onPressHeaderRight, sortComparator, renderUser }) => {
    const queryCreator = useCallback(() => createMemberListQuery(staleChannel), [staleChannel]);
    const { sdk, currentUser } = useSendbirdChat();
    const { STRINGS } = useLocalization();
    const { users, refreshing, refresh, next, error, loading } = useUserList(sdk, {
      queryCreator,
      sortComparator,
    });

    const _renderUser: NonNullable<typeof renderUser> = useCallback(
      (user, selectedUsers, setSelectedUsers) => {
        if (renderUser) return renderUser(user, selectedUsers, setSelectedUsers);

        return (
          <UserActionBar
            muted={user.isMuted}
            uri={user.profileUrl}
            label={user.role === 'operator' ? STRINGS.GROUP_CHANNEL_MEMBERS.USER_BAR_OPERATOR : ''}
            name={
              (user.nickname || STRINGS.LABELS.USER_NO_NAME) +
              (user.userId === currentUser?.userId ? STRINGS.GROUP_CHANNEL_MEMBERS.USER_BAR_ME_POSTFIX : '')
            }
            disabled={user.userId === currentUser?.userId}
            // TODO: implement ban/mute actions, use channel.members with handlers instead member query
            onPressActionMenu={undefined}
          />
        );
      },
      [renderUser],
    );
    return (
      <UserListModule.Provider headerRight={noop} headerTitle={STRINGS.GROUP_CHANNEL_MEMBERS.HEADER_TITLE}>
        <UserListModule.Header
          shouldActivateHeaderRight={() => true}
          onPressHeaderLeft={onPressHeaderLeft}
          right={<Icon icon={'plus'} />}
          onPressHeaderRight={async () => onPressHeaderRight()}
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

export default createGroupChannelMembersFragment;
