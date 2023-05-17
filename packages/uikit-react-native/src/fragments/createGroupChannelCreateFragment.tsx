import React from 'react';
import { TouchableOpacity } from 'react-native';

import { useUserList } from '@sendbird/uikit-chat-hooks';
import {
  PASS,
  SendbirdUser,
  UserStruct,
  getDefaultGroupChannelCreateParams,
  useFreshCallback,
} from '@sendbird/uikit-utils';

import StatusComposition from '../components/StatusComposition';
import UserSelectableBar from '../components/UserSelectableBar';
import type { GroupChannelCreateFragment } from '../domain/groupChannelUserList/types';
import createUserListModule from '../domain/userList/module/createUserListModule';
import type { UserListModule } from '../domain/userList/types';
import { useLocalization, useSendbirdChat } from '../hooks/useContext';

const createGroupChannelCreateFragment = <UserType extends UserStruct>(
  initModule?: Partial<UserListModule<UserType>>,
): GroupChannelCreateFragment<UserType> => {
  const UserListModule = createUserListModule<UserType>(initModule);

  return ({
    onPressHeaderLeft,
    onBeforeCreateChannel = PASS,
    onCreateChannel,
    sortComparator,
    queryCreator,
    channelType = 'GROUP',
    renderUser,
  }) => {
    const { sdk, currentUser } = useSendbirdChat();
    const { STRINGS } = useLocalization();
    const { users, refreshing, loading, error, refresh, next } = useUserList(sdk, {
      queryCreator,
      sortComparator,
    });

    const _renderUser: NonNullable<typeof renderUser> = useFreshCallback((user, selectedUsers, setSelectedUsers) => {
      if (queryCreator && !renderUser) {
        const hasRequiredKey = 'profileUrl' in user && 'nickname' in user;
        if (!hasRequiredKey) throw new Error('You should provide "renderUser" when providing "queryCreator"');
      }

      if (renderUser) return renderUser(user, selectedUsers, setSelectedUsers);

      const isMe = user.userId === currentUser?.userId;
      if (isMe) return null;

      const userIdx = selectedUsers.findIndex((u) => u.userId === user.userId);
      const isSelected = userIdx > -1;

      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setSelectedUsers(([...draft]) => {
              if (isSelected) draft.splice(userIdx, 1);
              else draft.push(user);
              return draft;
            });
          }}
        >
          <UserSelectableBar
            uri={(user as unknown as SendbirdUser).profileUrl}
            name={(user as unknown as SendbirdUser).nickname || STRINGS.LABELS.USER_NO_NAME}
            selected={isSelected}
            disabled={false}
          />
        </TouchableOpacity>
      );
    });

    return (
      <UserListModule.Provider
        headerRight={(selectedUsers) => STRINGS.GROUP_CHANNEL_CREATE.HEADER_RIGHT({ selectedUsers })}
        headerTitle={STRINGS.GROUP_CHANNEL_CREATE.HEADER_TITLE}
      >
        <UserListModule.Header
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={async (users) => {
            const params = getDefaultGroupChannelCreateParams({
              invitedUserIds: users.map((it) => it.userId),
              currentUserId: currentUser?.userId,
            });

            if (channelType === 'BROADCAST') params.isBroadcast = true;
            if (channelType === 'SUPER_GROUP') params.isSuper = true;

            const processedParams = await onBeforeCreateChannel(params, users);
            const channel = await sdk.groupChannel.createChannel(processedParams);
            onCreateChannel(channel);
          }}
        />
        <StatusComposition
          loading={loading}
          error={Boolean(error)}
          LoadingComponent={<UserListModule.StatusLoading />}
          ErrorComponent={<UserListModule.StatusError onPressRetry={() => refresh()} />}
        >
          <UserListModule.List
            onLoadNext={next}
            users={users}
            renderUser={_renderUser}
            onRefresh={refresh}
            refreshing={refreshing}
            ListEmptyComponent={<UserListModule.StatusEmpty />}
          />
        </StatusComposition>
      </UserListModule.Provider>
    );
  };
};

export default createGroupChannelCreateFragment;
