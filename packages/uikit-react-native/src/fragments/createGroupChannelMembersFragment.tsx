import React from 'react';

import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import type { ActionMenuItem } from '@sendbird/uikit-react-native-foundation';
import { Icon, useActionMenu } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMember } from '@sendbird/uikit-utils';
import { ifMuted, ifOperator, useForceUpdate, useFreshCallback, useUniqId } from '@sendbird/uikit-utils';

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
    const { openMenu } = useActionMenu();
    const { show } = useProfileCard();

    useChannelHandler(sdk, `${name}_${uniqId}`, {
      onChannelMemberCountChanged(channels) {
        if (channels.some((c) => c.url === channel.url)) forceUpdate();
      },
      onChannelChanged(eventChannel) {
        if (eventChannel.url === channel.url) forceUpdate();
      },
      onUserJoined(eventChannel) {
        if (eventChannel.url === channel.url) forceUpdate();
      },
      onUserLeft(eventChannel) {
        if (eventChannel.url === channel.url) forceUpdate();
      },
      onUserBanned(eventChannel) {
        if (eventChannel.url === channel.url) forceUpdate();
      },
      onUserUnbanned(eventChannel) {
        if (eventChannel.url === channel.url) forceUpdate();
      },
      onUserMuted(eventChannel) {
        if (eventChannel.url === channel.url) forceUpdate();
      },
      onUserUnmuted(eventChannel) {
        if (eventChannel.url === channel.url) forceUpdate();
      },
      onChannelFrozen(eventChannel) {
        if (eventChannel.url === channel.url) forceUpdate();
      },
      onChannelUnfrozen(eventChannel) {
        if (eventChannel.url === channel.url) forceUpdate();
      },
      onOperatorUpdated(eventChannel) {
        if (eventChannel.url === channel.url) forceUpdate();
      },
    });

    const _renderUser: NonNullable<typeof renderUser> = useFreshCallback((user, selectedUsers, setSelectedUsers) => {
      if (renderUser) return renderUser(user, selectedUsers, setSelectedUsers);

      return (
        <UserActionBar
          muted={user.isMuted}
          uri={user.profileUrl}
          label={user.role === 'operator' ? STRINGS.LABELS.USER_BAR_OPERATOR : ''}
          name={
            (user.nickname || STRINGS.LABELS.USER_NO_NAME) +
            (user.userId === currentUser?.userId ? STRINGS.LABELS.USER_BAR_ME_POSTFIX : '')
          }
          disabled={user.userId === currentUser?.userId}
          onPressActionMenu={ifOperator(channel.myRole, () => {
            const menuItems: ActionMenuItem['menuItems'] = [];

            menuItems.push({
              title: ifOperator(user.role, STRINGS.LABELS.UNREGISTER_OPERATOR, STRINGS.LABELS.REGISTER_AS_OPERATOR),
              onPress: ifOperator(
                user.role,
                () => channel.removeOperators([user.userId]),
                () => channel.addOperators([user.userId]),
              ),
            });

            if (!channel.isBroadcast) {
              menuItems.push({
                title: ifMuted(user.isMuted, STRINGS.LABELS.UNMUTE, STRINGS.LABELS.MUTE),
                onPress: ifMuted(
                  user.isMuted,
                  () => channel.unmuteUser(user),
                  () => channel.muteUser(user),
                ),
              });
            }

            menuItems.push({
              title: STRINGS.LABELS.BAN,
              style: 'destructive',
              onPress: () => channel.banUser(user),
            });

            openMenu({ title: user.nickname || STRINGS.LABELS.USER_NO_NAME, menuItems });
          })}
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
          users={channel.members}
          renderUser={_renderUser}
          onLoadNext={async () => void 0}
          ListEmptyComponent={<UserListModule.StatusEmpty />}
        />
      </UserListModule.Provider>
    );
  };
};

export default createGroupChannelMembersFragment;
