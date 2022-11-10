import React from 'react';

import { useUserList } from '@sendbird/uikit-chat-hooks';
import { useActionMenu } from '@sendbird/uikit-react-native-foundation';
import { NOOP, useFreshCallback } from '@sendbird/uikit-utils';

import StatusComposition from '../components/StatusComposition';
import UserActionBar from '../components/UserActionBar';
import { createGroupChannelBannedUsersModule } from '../domain/groupChannelBannedUsers';
import type {
  GroupChannelBannedUsersFragment,
  GroupChannelBannedUsersModule,
} from '../domain/groupChannelBannedUsers/types';
import { useLocalization, useSendbirdChat } from '../hooks/useContext';

const createGroupChannelBannedUsersFragment = (
  initModule?: Partial<GroupChannelBannedUsersModule>,
): GroupChannelBannedUsersFragment => {
  const GroupChannelBannedUsersModule = createGroupChannelBannedUsersModule(initModule);

  return ({ onPressHeaderLeft = NOOP, channel, renderUser }) => {
    const { STRINGS } = useLocalization();
    const { currentUser, sdk } = useSendbirdChat();
    const { openMenu } = useActionMenu();

    const { users, deleteUser, loading, next, refresh, error } = useUserList(sdk, {
      queryCreator: () => channel.createBannedUserListQuery({ limit: 20 }),
    });

    const _renderUser: NonNullable<typeof renderUser> = useFreshCallback((props) => {
      if (renderUser) return renderUser(props);

      const { user } = props;

      return (
        <UserActionBar
          muted={false}
          uri={user.profileUrl}
          name={
            (user.nickname || STRINGS.LABELS.USER_NO_NAME) +
            (user.userId === currentUser?.userId ? STRINGS.LABELS.USER_BAR_ME_POSTFIX : '')
          }
          disabled={user.userId === currentUser?.userId}
          onPressActionMenu={() => {
            openMenu({
              title: user.nickname || STRINGS.LABELS.USER_NO_NAME,
              menuItems: [
                {
                  title: STRINGS.LABELS.UNBAN,
                  onPress: () => channel.unbanUser(user).then(() => deleteUser(user.userId)),
                },
              ],
            });
          }}
        />
      );
    });

    return (
      <GroupChannelBannedUsersModule.Provider channel={channel}>
        <GroupChannelBannedUsersModule.Header onPressHeaderLeft={onPressHeaderLeft} />
        <StatusComposition
          loading={loading}
          LoadingComponent={<GroupChannelBannedUsersModule.StatusLoading />}
          error={Boolean(error)}
          ErrorComponent={<GroupChannelBannedUsersModule.StatusError onPressRetry={refresh} />}
        >
          <GroupChannelBannedUsersModule.List
            bannedUsers={users}
            renderUser={_renderUser}
            ListEmptyComponent={<GroupChannelBannedUsersModule.StatusEmpty />}
            onLoadNext={next}
          />
        </StatusComposition>
      </GroupChannelBannedUsersModule.Provider>
    );
  };
};

export default createGroupChannelBannedUsersFragment;
