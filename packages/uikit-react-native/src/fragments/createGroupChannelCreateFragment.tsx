import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import type Sendbird from 'sendbird';

import { useUserList } from '@sendbird/uikit-chat-hooks';
import type { GroupChannelCreateFragment, UserListModule } from '@sendbird/uikit-react-native-core';
import { createUserListModule, useLocalization, useSendbirdChat } from '@sendbird/uikit-react-native-core';
import StatusComposition from '@sendbird/uikit-react-native-core/src/components/StatusComposition';
import { Logger, PASS } from '@sendbird/uikit-utils';

import UserSelectableBar from '../ui/UserSelectableBar';

const defaultUserIdsGenerator = <T,>(users: T[]) => {
  const userIds = users
    .map((user) => {
      // @ts-ignore
      return user.userId as string | undefined;
    })
    .filter((u): u is string => Boolean(u));

  if (userIds.length === 0) {
    Logger.warn(
      'GroupChannelCreateFragment: Couldn\'t find user ids! if you provided "queryCreator", please provide "userIdsGenerator" as well',
    );
  }

  return userIds;
};

const createGroupChannelCreateFragment = <UserType,>(
  initModule?: Partial<UserListModule<UserType>>,
): GroupChannelCreateFragment<UserType> => {
  const UserListModule = createUserListModule<UserType>(initModule);

  return ({
    Header,
    userIdsGenerator = defaultUserIdsGenerator,
    onPressHeaderLeft,
    onBeforeCreateChannel = PASS,
    onCreateChannel,
    sortComparator,
    queryCreator,
    renderUser,
  }) => {
    const { sdk, currentUser } = useSendbirdChat();
    const { STRINGS } = useLocalization();
    const { users, refreshing, loading, error, refresh, next } = useUserList(sdk, {
      queryCreator,
      sortComparator,
    });

    const _renderUser: NonNullable<typeof renderUser> = useCallback(
      (user, selectedUsers, setSelectedUsers) => {
        if (queryCreator && !renderUser) {
          throw new Error('You should provide "renderUser" when providing "queryCreator"');
        }
        if (renderUser) return renderUser(user, selectedUsers, setSelectedUsers);

        const sbUser = user as unknown as Sendbird.User;
        const sbSelectedUsers = selectedUsers as unknown as Sendbird.User[];
        const sbSetSelectedUsers = setSelectedUsers as unknown as React.Dispatch<React.SetStateAction<Sendbird.User[]>>;

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
      },
      [renderUser, queryCreator],
    );

    return (
      <UserListModule.Provider
        headerRight={(selectedUsers) => STRINGS.GROUP_CHANNEL_CREATE.HEADER_RIGHT({ selectedUsers })}
        headerTitle={STRINGS.GROUP_CHANNEL_CREATE.HEADER_TITLE}
      >
        <UserListModule.Header
          Header={Header}
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={async (users) => {
            const params = new sdk.GroupChannelParams();

            if (currentUser) params.operatorUserIds = [currentUser.userId];
            params.addUserIds(userIdsGenerator(users));
            params.name = '';
            params.coverUrl = '';
            params.isDistinct = false;

            const processedParams = await onBeforeCreateChannel(params, users);
            const channel = await sdk.GroupChannel.createChannel(processedParams);
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
