import React from 'react';

import { useChannelHandler, useUserList } from '@sendbird/uikit-chat-hooks';
import { useActionMenu } from '@sendbird/uikit-react-native-foundation';
import { NOOP, ifThenOr, isDifferentChannel, useFreshCallback, useUniqHandlerId } from '@sendbird/uikit-utils';

import StatusComposition from '../components/StatusComposition';
import UserActionBar from '../components/UserActionBar';
import { createOpenChannelMutedParticipantsModule } from '../domain/openChannelMutedParticipants';
import type {
  OpenChannelMutedParticipantsFragment,
  OpenChannelMutedParticipantsModule,
} from '../domain/openChannelMutedParticipants/types';
import { useLocalization, useSendbirdChat } from '../hooks/useContext';

const createOpenChannelMutedParticipantsFragment = (
  initModule?: Partial<OpenChannelMutedParticipantsModule>,
): OpenChannelMutedParticipantsFragment => {
  const OpenChannelMutedParticipantsModule = createOpenChannelMutedParticipantsModule(initModule);

  return ({
    onPressHeaderLeft = NOOP,
    channel,
    renderUser,
    queryCreator = () => channel.createMutedUserListQuery({ limit: 20 }),
  }) => {
    const handlerId = useUniqHandlerId('OpenChannelMutedParticipants');

    const { STRINGS } = useLocalization();
    const { sdk, currentUser } = useSendbirdChat();
    const { openMenu } = useActionMenu();

    const { users, deleteUser, upsertUser, loading, refresh, error, next } = useUserList(sdk, { queryCreator });

    useChannelHandler(
      sdk,
      handlerId,
      {
        onUserMuted(eventChannel, user) {
          if (isDifferentChannel(eventChannel, channel)) return;
          upsertUser(user);
        },
        onUserUnmuted(eventChannel, user) {
          if (isDifferentChannel(eventChannel, channel)) return;
          deleteUser(user.userId);
        },
      },
      'open',
    );

    const _renderUser: NonNullable<typeof renderUser> = useFreshCallback((props) => {
      if (renderUser) return renderUser(props);

      const { user } = props;
      const isUserOperator = channel.isOperator(user.userId);

      return (
        <UserActionBar
          muted
          uri={user.profileUrl}
          label={ifThenOr(isUserOperator, STRINGS.LABELS.USER_BAR_OPERATOR, '')}
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
      <OpenChannelMutedParticipantsModule.Provider channel={channel}>
        <OpenChannelMutedParticipantsModule.Header onPressHeaderLeft={onPressHeaderLeft} />
        <StatusComposition
          loading={loading}
          LoadingComponent={<OpenChannelMutedParticipantsModule.StatusLoading />}
          error={Boolean(error)}
          ErrorComponent={<OpenChannelMutedParticipantsModule.StatusError onPressRetry={refresh} />}
        >
          <OpenChannelMutedParticipantsModule.List
            renderUser={_renderUser}
            mutedParticipants={users}
            onLoadNext={next}
            ListEmptyComponent={<OpenChannelMutedParticipantsModule.StatusEmpty />}
          />
        </StatusComposition>
      </OpenChannelMutedParticipantsModule.Provider>
    );
  };
};

export default createOpenChannelMutedParticipantsFragment;
