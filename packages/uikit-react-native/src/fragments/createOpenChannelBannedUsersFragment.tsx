import React from 'react';

import { useUserList } from '@sendbird/uikit-chat-hooks';
import { useActionMenu } from '@sendbird/uikit-react-native-foundation';
import { useFreshCallback } from '@sendbird/uikit-utils';

import StatusComposition from '../components/StatusComposition';
import UserActionBar from '../components/UserActionBar';
import { createOpenChannelBannedUsersModule } from '../domain/openChannelBannedUsers';
import type {
  OpenChannelBannedUsersFragment,
  OpenChannelBannedUsersModule,
} from '../domain/openChannelBannedUsers/types';
import { useLocalization, useSendbirdChat } from '../hooks/useContext';

const createOpenChannelBannedUsersFragment = (
  initModule?: Partial<OpenChannelBannedUsersModule>,
): OpenChannelBannedUsersFragment => {
  const OpenChannelBannedUsersModule = createOpenChannelBannedUsersModule(initModule);

  return ({
    onPressHeaderLeft,
    channel,
    renderUser,
    queryCreator = () => channel.createBannedUserListQuery({ limit: 20 }),
  }) => {
    const { STRINGS } = useLocalization();
    const { currentUser, sdk } = useSendbirdChat();
    const { openMenu } = useActionMenu();

    const { users, deleteUser, loading, next, refresh, error } = useUserList(sdk, { queryCreator });

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
      <OpenChannelBannedUsersModule.Provider channel={channel}>
        <OpenChannelBannedUsersModule.Header onPressHeaderLeft={onPressHeaderLeft} />
        <StatusComposition
          loading={loading}
          LoadingComponent={<OpenChannelBannedUsersModule.StatusLoading />}
          error={Boolean(error)}
          ErrorComponent={<OpenChannelBannedUsersModule.StatusError onPressRetry={refresh} />}
        >
          <OpenChannelBannedUsersModule.List
            renderUser={_renderUser}
            bannedUsers={users}
            onLoadNext={next}
            ListEmptyComponent={<OpenChannelBannedUsersModule.StatusEmpty />}
          />
        </StatusComposition>
      </OpenChannelBannedUsersModule.Provider>
    );
  };
};

export default createOpenChannelBannedUsersFragment;
