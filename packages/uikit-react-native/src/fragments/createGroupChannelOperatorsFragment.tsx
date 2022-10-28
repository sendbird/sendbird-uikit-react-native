import React from 'react';

import { useChannelHandler } from '@sendbird/uikit-chat-hooks';
import { useActionMenu } from '@sendbird/uikit-react-native-foundation';
import { ifOperator, useForceUpdate, useFreshCallback, useUniqId } from '@sendbird/uikit-utils';

import UserActionBar from '../components/UserActionBar';
import { createGroupChannelOperatorsModule } from '../domain/groupChannelOperators';
import type { GroupChannelOperatorsFragment, GroupChannelOperatorsModule } from '../domain/groupChannelOperators/types';
import { useLocalization, useProfileCard, useSendbirdChat } from '../hooks/useContext';

const name = 'createGroupChannelOperatorsFragment';
const createGroupChannelOperatorsFragment = (
  initModule?: Partial<GroupChannelOperatorsModule>,
): GroupChannelOperatorsFragment => {
  const GroupChannelOperatorsModule = createGroupChannelOperatorsModule(initModule);

  return ({ channel, onPressHeaderLeft, onPressHeaderRight, renderUser }) => {
    const uniqId = useUniqId(name);
    const forceUpdate = useForceUpdate();

    const { STRINGS } = useLocalization();
    const { sdk, currentUser } = useSendbirdChat();
    const { openMenu } = useActionMenu();
    const { show } = useProfileCard();

    useChannelHandler(sdk, `${name}_${uniqId}`, {
      onUserLeft(channel) {
        if (channel.url === channel.url) forceUpdate();
      },
      onUserBanned(channel) {
        if (channel.url === channel.url) forceUpdate();
      },
      onOperatorUpdated(channel) {
        if (channel.url === channel.url) forceUpdate();
      },
    });

    const _renderUser: NonNullable<typeof renderUser> = useFreshCallback((props) => {
      if (renderUser) return renderUser(props);

      const { user } = props;
      return (
        <UserActionBar
          muted={false}
          uri={user.profileUrl}
          label={user.role === 'operator' ? STRINGS.LABELS.USER_BAR_OPERATOR : ''}
          name={
            (user.nickname || STRINGS.LABELS.USER_NO_NAME) +
            (user.userId === currentUser?.userId ? STRINGS.LABELS.USER_BAR_ME_POSTFIX : '')
          }
          disabled={user.userId === currentUser?.userId}
          onPressActionMenu={ifOperator(channel.myRole, () => {
            openMenu({
              title: user.nickname || STRINGS.LABELS.USER_NO_NAME,
              menuItems: [
                {
                  title: ifOperator(user.role, STRINGS.LABELS.UNREGISTER_OPERATOR, STRINGS.LABELS.REGISTER_AS_OPERATOR),
                  onPress: ifOperator(
                    user.role,
                    () => channel.removeOperators([user.userId]),
                    () => channel.addOperators([user.userId]),
                  ),
                },
              ],
            });
          })}
          onPressAvatar={() => show(user)}
        />
      );
    });

    return (
      <GroupChannelOperatorsModule.Provider>
        <GroupChannelOperatorsModule.Header
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={async () => onPressHeaderRight()}
        />

        <GroupChannelOperatorsModule.List
          operators={channel.members.filter((it) => it.role === 'operator')}
          renderUser={_renderUser}
          ListEmptyComponent={<GroupChannelOperatorsModule.StatusEmpty />}
        />
      </GroupChannelOperatorsModule.Provider>
    );
  };
};

export default createGroupChannelOperatorsFragment;
