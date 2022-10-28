import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useActionMenu } from '@sendbird/uikit-react-native-foundation';
import { NOOP, SendbirdGroupChannel, SendbirdRestrictedUser, useFreshCallback } from '@sendbird/uikit-utils';

import StatusComposition from '../components/StatusComposition';
import UserActionBar from '../components/UserActionBar';
import { createGroupChannelBannedUsersModule } from '../domain/groupChannelBannedUsers';
import type {
  GroupChannelBannedUsersFragment,
  GroupChannelBannedUsersModule,
} from '../domain/groupChannelBannedUsers/types';
import { useLocalization, useSendbirdChat } from '../hooks/useContext';

const createBannedUserListQuery = (channel: SendbirdGroupChannel) => {
  return channel.createBannedUserListQuery({ limit: 20 });
};

const createGroupChannelBannedUsersFragment = (
  initModule?: Partial<GroupChannelBannedUsersModule>,
): GroupChannelBannedUsersFragment => {
  const GroupChannelBannedUsersModule = createGroupChannelBannedUsersModule(initModule);

  return ({ onPressHeaderLeft = NOOP, channel, renderUser }) => {
    const { STRINGS } = useLocalization();
    const { currentUser } = useSendbirdChat();
    const { openMenu } = useActionMenu();

    const query = useRef(createBannedUserListQuery(channel));
    const [bannedUsers, setBannedUsers] = useState<SendbirdRestrictedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>();

    const init = useCallback(async () => {
      try {
        const users = await query.current.next();
        setBannedUsers(users);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }, []);

    const refresh = useCallback(async () => {
      setLoading(true);
      setError(undefined);
      query.current = createBannedUserListQuery(channel);
      await init();
    }, []);

    const next = useCallback(async () => {
      if (query.current.hasNext) {
        const users = await query.current.next();
        setBannedUsers((prev) => [...prev, ...users]);
      }
    }, []);

    const unban = async (user: SendbirdRestrictedUser) => {
      await channel.unbanUser(user);
      setBannedUsers(([...draft]) => {
        const unbannedUserIdx = draft.findIndex((it) => it.userId === user.userId);
        if (unbannedUserIdx > -1) draft.splice(unbannedUserIdx, 1);
        return draft;
      });
    };

    useEffect(() => {
      init();
    }, []);

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
              menuItems: [{ title: STRINGS.LABELS.UNBAN, onPress: () => unban(user) }],
            });
          }}
        />
      );
    });

    return (
      <GroupChannelBannedUsersModule.Provider>
        <GroupChannelBannedUsersModule.Header onPressHeaderLeft={onPressHeaderLeft} />
        <StatusComposition
          loading={loading}
          LoadingComponent={<GroupChannelBannedUsersModule.StatusLoading />}
          error={Boolean(error)}
          ErrorComponent={<GroupChannelBannedUsersModule.StatusError onPressRetry={refresh} />}
        >
          <GroupChannelBannedUsersModule.List
            bannedUsers={bannedUsers}
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
