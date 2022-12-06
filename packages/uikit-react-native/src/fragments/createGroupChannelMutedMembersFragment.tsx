import React from 'react';

import { useChannelHandler, useUserList } from '@sendbird/uikit-chat-hooks';
import { useActionMenu } from '@sendbird/uikit-react-native-foundation';
import { NOOP, isDifferentChannel, useFreshCallback, useUniqId } from '@sendbird/uikit-utils';

import StatusComposition from '../components/StatusComposition';
import UserActionBar from '../components/UserActionBar';
import { createGroupChannelMutedMembersModule } from '../domain/groupChannelMutedMembers';
import type {
  GroupChannelMutedMembersFragment,
  GroupChannelMutedMembersModule,
} from '../domain/groupChannelMutedMembers/types';
import { useLocalization, useSendbirdChat } from '../hooks/useContext';

const HOOK_NAME = 'createGroupChannelMutedMembersFragment';
const createGroupChannelMutedMembersFragment = (
  initModule?: Partial<GroupChannelMutedMembersModule>,
): GroupChannelMutedMembersFragment => {
  const GroupChannelMutedMembersModule = createGroupChannelMutedMembersModule(initModule);

  return ({ onPressHeaderLeft = NOOP, channel, renderUser }) => {
    const uniqId = useUniqId(HOOK_NAME);

    const { STRINGS } = useLocalization();
    const { sdk, currentUser } = useSendbirdChat();
    const { openMenu } = useActionMenu();

    const { users, deleteUser, loading, refresh, error, next } = useUserList(sdk, {
      queryCreator: () => channel.createMutedUserListQuery({ limit: 20 }),
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
    });

    const _renderUser: NonNullable<typeof renderUser> = useFreshCallback((props) => {
      if (renderUser) return renderUser(props);

      const { user } = props;
      return (
        <UserActionBar
          muted
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
                  title: STRINGS.LABELS.UNMUTE,
                  onPress: () => channel.unmuteUser(user).then(() => deleteUser(user.userId)),
                },
              ],
            });
          }}
        />
      );
    });

    return (
      <GroupChannelMutedMembersModule.Provider channel={channel}>
        <GroupChannelMutedMembersModule.Header onPressHeaderLeft={onPressHeaderLeft} />
        <StatusComposition
          loading={loading}
          LoadingComponent={<GroupChannelMutedMembersModule.StatusLoading />}
          error={Boolean(error)}
          ErrorComponent={<GroupChannelMutedMembersModule.StatusError onPressRetry={refresh} />}
        >
          <GroupChannelMutedMembersModule.List
            mutedMembers={users}
            onLoadNext={next}
            renderUser={_renderUser}
            ListEmptyComponent={<GroupChannelMutedMembersModule.StatusEmpty />}
          />
        </StatusComposition>
      </GroupChannelMutedMembersModule.Provider>
    );
  };
};

export default createGroupChannelMutedMembersFragment;
