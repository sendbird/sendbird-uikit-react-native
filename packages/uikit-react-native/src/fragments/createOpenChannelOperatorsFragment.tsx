import React from 'react';

import { useChannelHandler, useUserList } from '@sendbird/uikit-chat-hooks';
import { useActionMenu } from '@sendbird/uikit-react-native-foundation';
import { NOOP, ifThenOr, isDifferentChannel, useFreshCallback, useUniqHandlerId } from '@sendbird/uikit-utils';

import StatusComposition from '../components/StatusComposition';
import UserActionBar from '../components/UserActionBar';
import { UNKNOWN_USER_ID } from '../constants';
import { createOpenChannelOperatorsModule } from '../domain/openChannelOperators';
import type { OpenChannelOperatorsFragment, OpenChannelOperatorsModule } from '../domain/openChannelOperators/types';
import { useLocalization, useSendbirdChat, useUserProfile } from '../hooks/useContext';

const createOpenChannelOperatorsFragment = (
  initModule?: Partial<OpenChannelOperatorsModule>,
): OpenChannelOperatorsFragment => {
  const OpenChannelOperatorsModule = createOpenChannelOperatorsModule(initModule);

  return ({
    onPressHeaderLeft = NOOP,
    onPressHeaderRight = NOOP,
    channel,
    renderUser,
    queryCreator = () => channel.createOperatorListQuery({ limit: 20 }),
  }) => {
    const handlerId = useUniqHandlerId('OpenChannelOperatorsFragment');

    const { STRINGS } = useLocalization();
    const { sdk, currentUser } = useSendbirdChat();
    const { openMenu } = useActionMenu();
    const { show } = useUserProfile();

    const { users, deleteUser, upsertUser, loading, refresh, next, error } = useUserList(sdk, { queryCreator });

    useChannelHandler(
      sdk,
      handlerId,
      {
        onUserBanned(eventChannel, user) {
          if (isDifferentChannel(eventChannel, channel)) return;
          deleteUser(user.userId);
        },
        onOperatorUpdated(eventChannel, updatedUsers) {
          if (isDifferentChannel(eventChannel, channel)) return;
          const operatorsAdded = users.length < updatedUsers.length;
          if (operatorsAdded) updatedUsers.forEach(upsertUser);
        },
      },
      'open',
    );

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
          onPressActionMenu={ifThenOr(channel.isOperator(currentUser?.userId ?? UNKNOWN_USER_ID), () => {
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
      <OpenChannelOperatorsModule.Provider channel={channel}>
        <OpenChannelOperatorsModule.Header
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={onPressHeaderRight}
        />
        <StatusComposition
          loading={loading}
          LoadingComponent={<OpenChannelOperatorsModule.StatusLoading />}
          error={Boolean(error)}
          ErrorComponent={<OpenChannelOperatorsModule.StatusError onPressRetry={refresh} />}
        >
          <OpenChannelOperatorsModule.List
            operators={users}
            renderUser={_renderUser}
            onLoadNext={next}
            ListEmptyComponent={<OpenChannelOperatorsModule.StatusEmpty />}
          />
        </StatusComposition>
      </OpenChannelOperatorsModule.Provider>
    );
  };
};

export default createOpenChannelOperatorsFragment;
