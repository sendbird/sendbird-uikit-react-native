import React from 'react';

import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import { useActionMenu } from '@sendbird/uikit-react-native-foundation';
import { NOOP, ifMuted, useForceUpdate, useFreshCallback, useUniqId } from '@sendbird/uikit-utils';

import UserActionBar from '../components/UserActionBar';
import { createGroupChannelMutedMembersModule } from '../domain/groupChannelMutedMembers';
import type {
  GroupChannelMutedMembersFragment,
  GroupChannelMutedMembersModule,
} from '../domain/groupChannelMutedMembers/types';
import { useLocalization, useSendbirdChat } from '../hooks/useContext';

const name = 'createGroupChannelMutedMembersFragment';
const createGroupChannelMutedMembersFragment = (
  initModule?: Partial<GroupChannelMutedMembersModule>,
): GroupChannelMutedMembersFragment => {
  const GroupChannelMutedMembersModule = createGroupChannelMutedMembersModule(initModule);

  return ({ onPressHeaderLeft = NOOP, channel, renderUser }) => {
    const uniqId = useUniqId(name);
    const forceUpdate = useForceUpdate();

    const { STRINGS } = useLocalization();
    const { sdk, currentUser } = useSendbirdChat();
    const { openMenu } = useActionMenu();

    useChannelHandler(sdk, `${name}_${uniqId}`, {
      onUserLeft(channel) {
        if (channel.url === channel.url) forceUpdate();
      },
      onUserBanned(channel) {
        if (channel.url === channel.url) forceUpdate();
      },
      onUserUnmuted(channel) {
        if (channel.url === channel.url) forceUpdate();
      },
    });

    const _renderUser: NonNullable<typeof renderUser> = useFreshCallback((props) => {
      if (renderUser) return renderUser(props);

      const { user } = props;
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
          onPressActionMenu={() => {
            openMenu({
              title: user.nickname || STRINGS.LABELS.USER_NO_NAME,
              menuItems: [
                {
                  title: ifMuted(user.isMuted, STRINGS.LABELS.UNMUTE, STRINGS.LABELS.MUTE),
                  onPress: ifMuted(
                    user.isMuted,
                    () => channel.unmuteUser(user),
                    () => channel.muteUser(user),
                  ),
                },
              ],
            });
          }}
        />
      );
    });

    return (
      <GroupChannelMutedMembersModule.Provider>
        <GroupChannelMutedMembersModule.Header onPressHeaderLeft={onPressHeaderLeft} />
        <GroupChannelMutedMembersModule.List
          mutedMembers={channel.members.filter((it) => it.isMuted)}
          renderUser={_renderUser}
          ListEmptyComponent={<GroupChannelMutedMembersModule.StatusEmpty />}
        />
      </GroupChannelMutedMembersModule.Provider>
    );
  };
};

export default createGroupChannelMutedMembersFragment;
