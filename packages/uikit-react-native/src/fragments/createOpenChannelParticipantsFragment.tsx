import React, { useRef } from 'react';

import { useChannelHandler, useUserList } from '@sendbird/uikit-chat-hooks';
import type { ActionMenuItem } from '@sendbird/uikit-react-native-foundation';
import { useActionMenu } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdParticipant } from '@sendbird/uikit-utils';
import { ASYNC_NOOP, ifThenOr, isDifferentChannel, useFreshCallback, useUniqHandlerId } from '@sendbird/uikit-utils';

import StatusComposition from '../components/StatusComposition';
import UserActionBar from '../components/UserActionBar';
import { UNKNOWN_USER_ID } from '../constants';
import type { OpenChannelParticipantsFragment } from '../domain/openChannelUserList/types';
import createUserListModule from '../domain/userList/module/createUserListModule';
import type { UserListModule } from '../domain/userList/types';
import { useLocalization, useSendbirdChat, useUserProfile } from '../hooks/useContext';

const RETURN_EMPTY_STRING = () => '';
const createOpenChannelParticipantsFragment = (
  initModule?: Partial<UserListModule<SendbirdParticipant>>,
): OpenChannelParticipantsFragment => {
  const UserListModule = createUserListModule<SendbirdParticipant>(initModule);

  return ({
    channel,
    onPressHeaderLeft,
    renderUser,
    sortComparator,
    queryCreator = () => channel.createParticipantListQuery({ limit: 20 }),
  }) => {
    const handlerId = useUniqHandlerId('OpenChannelParticipantsFragment');

    const refreshSchedule = useRef<NodeJS.Timeout>();
    const { STRINGS } = useLocalization();
    const { sdk, currentUser } = useSendbirdChat();
    const { openMenu } = useActionMenu();
    const { show } = useUserProfile();

    const { users, refresh, loading, next, error, upsertUser, deleteUser } = useUserList(sdk, {
      queryCreator,
      sortComparator,
    });

    useChannelHandler(
      sdk,
      handlerId,
      {
        onUserExited(eventChannel, user) {
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
          if (isDifferentChannel(eventChannel, channel) || !eventChannel.isOpenChannel()) return;
          // @ts-ignore - SDK should migrate User to Participant
          user.isMuted = true;
          upsertUser(user);
        },
        onUserUnmuted(eventChannel, user) {
          if (isDifferentChannel(eventChannel, channel) || !eventChannel.isOpenChannel()) return;
          // @ts-ignore - SDK should migrate User to Participant
          user.isMuted = false;
          upsertUser(user);
        },
      },
      'open',
    );

    const _renderUser: NonNullable<typeof renderUser> = useFreshCallback((user, selectedUsers, setSelectedUsers) => {
      if (renderUser) return renderUser(user, selectedUsers, setSelectedUsers);

      const isUserMuted = user.isMuted;
      const isUserOperator = channel.isOperator(user.userId);
      const isCurrentUserOperator = channel.isOperator(currentUser?.userId ?? UNKNOWN_USER_ID);

      return (
        <UserActionBar
          muted={isUserMuted}
          uri={user.profileUrl}
          label={ifThenOr(isUserOperator, STRINGS.LABELS.USER_BAR_OPERATOR, '')}
          name={
            (user.nickname || STRINGS.LABELS.USER_NO_NAME) +
            ifThenOr(user.userId === currentUser?.userId, STRINGS.LABELS.USER_BAR_ME_POSTFIX, '')
          }
          disabled={user.userId === currentUser?.userId}
          onPressActionMenu={ifThenOr(isCurrentUserOperator, () => {
            const menuItems: ActionMenuItem['menuItems'] = [];

            menuItems.push({
              title: ifThenOr(isUserOperator, STRINGS.LABELS.UNREGISTER_OPERATOR, STRINGS.LABELS.REGISTER_AS_OPERATOR),
              onPress: ifThenOr(
                isUserOperator,
                () => channel.removeOperators([user.userId]),
                () => channel.addOperators([user.userId]),
              ),
            });

            menuItems.push({
              title: ifThenOr(isUserMuted, STRINGS.LABELS.UNMUTE, STRINGS.LABELS.MUTE),
              onPress: ifThenOr(
                isUserMuted,
                () => channel.unmuteUser(user),
                () => channel.muteUser(user),
              ),
            });

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
      <UserListModule.Provider
        headerRight={RETURN_EMPTY_STRING}
        headerTitle={STRINGS.OPEN_CHANNEL_PARTICIPANTS.HEADER_TITLE}
      >
        <UserListModule.Header onPressHeaderRight={ASYNC_NOOP} onPressHeaderLeft={onPressHeaderLeft} />
        <StatusComposition
          loading={loading}
          LoadingComponent={<UserListModule.StatusLoading />}
          error={Boolean(error)}
          ErrorComponent={<UserListModule.StatusError onPressRetry={refresh} />}
        >
          <UserListModule.List
            users={users as SendbirdParticipant[]}
            renderUser={_renderUser}
            onLoadNext={next}
            ListEmptyComponent={<UserListModule.StatusEmpty />}
          />
        </StatusComposition>
      </UserListModule.Provider>
    );
  };
};

export default createOpenChannelParticipantsFragment;
