import React from 'react';

import { useActiveGroupChannel, useChannelHandler } from '@sendbird/uikit-chat-hooks';
import { Icon } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMember } from '@sendbird/uikit-utils';
import { useForceUpdate, useFreshCallback, useUniqId } from '@sendbird/uikit-utils';

import UserActionBar from '../components/UserActionBar';
import type { GroupChannelMembersFragment } from '../domain/groupChannelUserList/types';
import createUserListModule from '../domain/userList/module/createUserListModule';
import type { UserListModule } from '../domain/userList/types';
import { useLocalization, useProfileCard, useSendbirdChat } from '../hooks/useContext';

const noop = () => '';
const name = 'createGroupChannelMembersFragment';
const createGroupChannelMembersFragment = (
  initModule?: Partial<UserListModule<SendbirdMember>>,
): GroupChannelMembersFragment<SendbirdMember> => {
  const UserListModule = createUserListModule<SendbirdMember>(initModule);

  return ({ channel, onPressHeaderLeft, onPressHeaderRight, renderUser }) => {
    const uniqId = useUniqId(name);
    const forceUpdate = useForceUpdate();

    const { STRINGS } = useLocalization();
    const { sdk, currentUser } = useSendbirdChat();
    const { show } = useProfileCard();

    const { activeChannel } = useActiveGroupChannel(sdk, channel);

    useChannelHandler(sdk, `${name}_${uniqId}`, {
      // Note: Removed from v4
      // onUserEntered(channel) {
      //   if (channel.url === activeChannel.url) forceUpdate();
      // },
      onUserLeft(channel) {
        if (channel.url === activeChannel.url) forceUpdate();
      },
      onUserJoined(channel) {
        if (channel.url === activeChannel.url) forceUpdate();
      },
      onUserUnmuted(channel) {
        if (channel.url === activeChannel.url) forceUpdate();
      },
      onUserUnbanned(channel) {
        if (channel.url === activeChannel.url) forceUpdate();
      },
      onUserBanned(channel) {
        if (channel.url === activeChannel.url) forceUpdate();
      },
      onUserMuted(channel) {
        if (channel.url === activeChannel.url) forceUpdate();
      },
      onChannelMemberCountChanged(channels) {
        if (channels.find((c) => c.url === channel.url)) forceUpdate();
      },
      onChannelChanged(channel) {
        if (channel.url === activeChannel.url) forceUpdate();
      },
      onChannelFrozen(channel) {
        if (channel.url === activeChannel.url) forceUpdate();
      },
      onChannelUnfrozen(channel) {
        if (channel.url === activeChannel.url) forceUpdate();
      },
    });

    const _renderUser: NonNullable<typeof renderUser> = useFreshCallback((user, selectedUsers, setSelectedUsers) => {
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
          onPressAvatar={() => show(user)}
        />
      );
    });

    return (
      <UserListModule.Provider headerRight={noop} headerTitle={STRINGS.GROUP_CHANNEL_MEMBERS.HEADER_TITLE}>
        <UserListModule.Header
          shouldActivateHeaderRight={() => true}
          onPressHeaderLeft={onPressHeaderLeft}
          right={<Icon icon={'plus'} />}
          onPressHeaderRight={async () => onPressHeaderRight()}
        />

        <UserListModule.List
          users={activeChannel.members}
          renderUser={_renderUser}
          onLoadNext={async () => void 0}
          ListEmptyComponent={<UserListModule.StatusEmpty />}
        />
      </UserListModule.Provider>
    );
  };
};

export default createGroupChannelMembersFragment;
