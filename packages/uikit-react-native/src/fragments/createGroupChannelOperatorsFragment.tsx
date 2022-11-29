import React from 'react';

import { useChannelHandler, useUserList } from '@sendbird/uikit-chat-hooks';
import { useActionMenu } from '@sendbird/uikit-react-native-foundation';
import { ifOperator, isDifferentChannel, useFreshCallback, useUniqId } from '@sendbird/uikit-utils';

import StatusComposition from '../components/StatusComposition';
import UserActionBar from '../components/UserActionBar';
import { createGroupChannelOperatorsModule } from '../domain/groupChannelOperators';
import type { GroupChannelOperatorsFragment, GroupChannelOperatorsModule } from '../domain/groupChannelOperators/types';
import { useLocalization, useSendbirdChat, useUserProfile } from '../hooks/useContext';

const name = 'createGroupChannelOperatorsFragment';
const createGroupChannelOperatorsFragment = (
  initModule?: Partial<GroupChannelOperatorsModule>,
): GroupChannelOperatorsFragment => {
  const GroupChannelOperatorsModule = createGroupChannelOperatorsModule(initModule);

  return ({ channel, onPressHeaderLeft, onPressHeaderRight, renderUser }) => {
    const uniqId = useUniqId(name);

    const { STRINGS } = useLocalization();
    const { sdk, currentUser } = useSendbirdChat();
    const { openMenu } = useActionMenu();
    const { show } = useUserProfile();

    const { users, deleteUser, upsertUser, loading, refresh, next, error } = useUserList(sdk, {
      queryCreator: () => channel.createOperatorListQuery({ limit: 20 }),
    });

    useChannelHandler(sdk, `${name}_${uniqId}`, {
      onUserLeft(eventChannel, user) {
        if (isDifferentChannel(eventChannel, channel)) return;
        deleteUser(user.userId);
      },
      onUserBanned(eventChannel, user) {
        if (isDifferentChannel(eventChannel, channel)) return;
        deleteUser(user.userId);
      },
      onOperatorUpdated(eventChannel, updatedUsers) {
        if (isDifferentChannel(eventChannel, channel)) return;
        const operatorsAdded = users.length < updatedUsers.length;
        if (operatorsAdded) updatedUsers.forEach(upsertUser);
      },
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
          onPressAvatar={() => show(user)}
          onPressActionMenu={ifOperator(channel.myRole, () => {
            openMenu({
              title: user.nickname || STRINGS.LABELS.USER_NO_NAME,
              menuItems: [
                {
                  title: STRINGS.LABELS.UNREGISTER_OPERATOR,
                  onPress: () => channel.removeOperators([user.userId]).then(() => deleteUser(user.userId)),
                },
              ],
            });
          })}
        />
      );
    });

    return (
      <GroupChannelOperatorsModule.Provider channel={channel}>
        <GroupChannelOperatorsModule.Header
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={onPressHeaderRight}
        />

        <StatusComposition
          loading={loading}
          LoadingComponent={<GroupChannelOperatorsModule.StatusLoading />}
          error={Boolean(error)}
          ErrorComponent={<GroupChannelOperatorsModule.StatusError onPressRetry={refresh} />}
        >
          <GroupChannelOperatorsModule.List
            operators={users}
            renderUser={_renderUser}
            onLoadNext={next}
            ListEmptyComponent={<GroupChannelOperatorsModule.StatusEmpty />}
          />
        </StatusComposition>
      </GroupChannelOperatorsModule.Provider>
    );
  };
};

export default createGroupChannelOperatorsFragment;
