import React, { useRef } from 'react';

import { useChannelHandler, useUserList } from '@sendbird/uikit-chat-hooks';
import type { ActionMenuItem } from '@sendbird/uikit-react-native-foundation';
import { Icon, useActionMenu } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMember } from '@sendbird/uikit-utils';
import { ifMuted, ifOperator, isDifferentChannel, useFreshCallback, useUniqId } from '@sendbird/uikit-utils';

import StatusComposition from '../components/StatusComposition';
import UserActionBar from '../components/UserActionBar';
import type { GroupChannelMembersFragment } from '../domain/groupChannelUserList/types';
import createUserListModule from '../domain/userList/module/createUserListModule';
import type { UserListModule } from '../domain/userList/types';
import { useLocalization, useSendbirdChat, useUserProfile } from '../hooks/useContext';

const noop = () => '';
const HOOK_NAME = 'createGroupChannelMembersFragment';
const createGroupChannelMembersFragment = (
  initModule?: Partial<UserListModule<SendbirdMember>>,
): GroupChannelMembersFragment<SendbirdMember> => {
  const UserListModule = createUserListModule<SendbirdMember>(initModule);

  return ({ channel, onPressHeaderLeft, onPressHeaderRight, renderUser }) => {
    const uniqId = useUniqId(HOOK_NAME);

    const refreshSchedule = useRef<NodeJS.Timeout>();
    const { STRINGS } = useLocalization();
    const { sdk, currentUser } = useSendbirdChat();
    const { openMenu } = useActionMenu();
    const { show } = useUserProfile();

    const { users, refresh, loading, next, error, upsertUser, deleteUser } = useUserList(sdk, {
      queryCreator: () => channel.createMemberListQuery({ limit: 20 }),
    });

    useChannelHandler(sdk, `${HOOK_NAME}_${uniqId}`, {
      onUserLeft(eventChannel, user) {
        if (isDifferentChannel(eventChannel, channel)) return;
        deleteUser(user.userId);
      },
      onUserBanned(eventChannel, user) {
        if (isDifferentChannel(eventChannel, channel)) return;
        deleteUser(user.userId);
      },
      onOperatorUpdated(eventChannel) {
        if (isDifferentChannel(eventChannel, channel)) return;
        if (refreshSchedule.current) clearTimeout(refreshSchedule.current);
        refreshSchedule.current = setTimeout(() => refresh(), 500);
      },
      onUserMuted(eventChannel, user) {
        if (isDifferentChannel(eventChannel, channel) || !eventChannel.isGroupChannel()) return;

        const memberFromChannel = eventChannel.members.find((it) => it.userId === user.userId);
        if (memberFromChannel) return upsertUser(memberFromChannel);

        const memberFromList = users.find((it) => it.userId === user.userId);
        if (memberFromList) {
          memberFromList.isMuted = true;
          upsertUser(memberFromList);
        }
      },
      onUserUnmuted(eventChannel, user) {
        if (isDifferentChannel(eventChannel, channel) || !eventChannel.isGroupChannel()) return;

        const memberFromChannel = eventChannel.members.find((it) => it.userId === user.userId);
        if (memberFromChannel) return upsertUser(memberFromChannel);

        const memberFromList = users.find((it) => it.userId === user.userId);
        if (memberFromList) {
          memberFromList.isMuted = false;
          upsertUser(memberFromList);
        }
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
        <StatusComposition
          loading={loading}
          LoadingComponent={<UserListModule.StatusLoading />}
          error={Boolean(error)}
          ErrorComponent={<UserListModule.StatusError onPressRetry={refresh} />}
        >
          <UserListModule.List
            users={users}
            renderUser={_renderUser}
            onLoadNext={next}
            ListEmptyComponent={<UserListModule.StatusEmpty />}
          />
        </StatusComposition>
      </UserListModule.Provider>
    );
  };
};

export default createGroupChannelMembersFragment;
