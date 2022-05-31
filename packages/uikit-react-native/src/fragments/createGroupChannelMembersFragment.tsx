import React, { useCallback } from 'react';
import type Sendbird from 'sendbird';

import { CustomQuery, useUserList } from '@sendbird/uikit-chat-hooks';
import type { GroupChannelMembersFragment, UserListModule } from '@sendbird/uikit-react-native-core';
import { createUserListModule, useLocalization, useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { Icon } from '@sendbird/uikit-react-native-foundation';

import UserActionBar from '../ui/UserActionBar';

const noop = () => '';
const createMemberListQuery = (channel: Sendbird.GroupChannel) => {
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
  initModule?: UserListModule<Sendbird.Member>,
): GroupChannelMembersFragment<Sendbird.Member> => {
  const UserListModule = createUserListModule<Sendbird.Member>(initModule);

  return ({ Header, channel, onPressHeaderLeft, onPressHeaderRight, sortComparator, renderUser, children }) => {
    const queryCreator = useCallback(() => createMemberListQuery(channel), [channel]);
    const { sdk, currentUser } = useSendbirdChat();
    const { LABEL } = useLocalization();
    const { users, refreshing, refresh, next } = useUserList(sdk, {
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
            label={user.role === 'operator' ? LABEL.GROUP_CHANNEL_MEMBERS.USER_BAR_OPERATOR : ''}
            name={
              (user.nickname || LABEL.STRINGS.USER_NO_NAME) +
              (user.userId === currentUser?.userId ? LABEL.GROUP_CHANNEL_MEMBERS.USER_BAR_ME_POSTFIX : '')
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
      <UserListModule.Provider headerRight={noop} headerTitle={LABEL.GROUP_CHANNEL_MEMBERS.HEADER_TITLE}>
        <UserListModule.Header
          ignoreActiveOnly
          Header={Header}
          onPressHeaderLeft={onPressHeaderLeft}
          right={<Icon icon={'plus'} />}
          onPressHeaderRight={async () => onPressHeaderRight()}
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

export default createGroupChannelMembersFragment;
