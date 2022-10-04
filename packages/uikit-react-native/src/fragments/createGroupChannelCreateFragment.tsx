import React from 'react';
import { TouchableOpacity } from 'react-native';

import { useUserList } from '@sendbird/uikit-chat-hooks';
import { Logger, PASS, SendbirdGroupChannelCreateParams, SendbirdUser, useFreshCallback } from '@sendbird/uikit-utils';

import StatusComposition from '../components/StatusComposition';
import UserSelectableBar from '../components/UserSelectableBar';
import type { GroupChannelCreateFragment } from '../domain/groupChannelUserList/types';
import createUserListModule from '../domain/userList/module/createUserListModule';
import type { UserListModule } from '../domain/userList/types';
import { useLocalization, useSendbirdChat } from '../hooks/useContext';

const defaultUserIdsGenerator = <T,>(users: T[]) => {
  const userIds = users
    .map((user) => {
      // @ts-ignore
      return user.userId as string | undefined;
    })
    .filter((u): u is string => Boolean(u));

  if (userIds.length === 0) {
    Logger.warn(
      'GroupChannelCreateFragment: Couldn\'t find user ids! if you provide "queryCreator", please provide "userIdsGenerator" as well',
    );
  }

  return userIds;
};

const createGroupChannelCreateFragment = <UserType,>(
  initModule?: Partial<UserListModule<UserType>>,
): GroupChannelCreateFragment<UserType> => {
  const UserListModule = createUserListModule<UserType>(initModule);

  return ({
    userIdsGenerator = defaultUserIdsGenerator,
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
        throw new Error('You should provide "renderUser" when providing "queryCreator"');
      }
      if (renderUser) return renderUser(user, selectedUsers, setSelectedUsers);

      const sbUser = user as unknown as SendbirdUser;
      const sbSelectedUsers = selectedUsers as unknown as SendbirdUser[];
      const sbSetSelectedUsers = setSelectedUsers as unknown as React.Dispatch<React.SetStateAction<SendbirdUser[]>>;

      const isMe = sbUser.userId === currentUser?.userId;
      if (isMe) return null;

      const userIdx = sbSelectedUsers.findIndex((u) => u.userId === sbUser.userId);
      const isSelected = userIdx > -1;

      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            sbSetSelectedUsers(([...draft]) => {
              if (isSelected) draft.splice(userIdx, 1);
              else draft.push(sbUser);
              return draft;
            });
          }}
        >
          <UserSelectableBar
            uri={sbUser.profileUrl}
            name={sbUser.nickname || STRINGS.LABELS.USER_NO_NAME}
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
            const params: SendbirdGroupChannelCreateParams = {
              invitedUserIds: userIdsGenerator(users),
              name: '',
              coverUrl: '',
              isDistinct: false,
            };

            if (channelType === 'BROADCAST') params.isBroadcast = true;
            if (channelType === 'SUPER_GROUP') params.isSuper = true;
            if (currentUser) params.operatorUserIds = [currentUser.userId];

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
