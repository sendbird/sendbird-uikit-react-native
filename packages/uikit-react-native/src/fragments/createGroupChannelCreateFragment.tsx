import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import type Sendbird from 'sendbird';

import { useUserList } from '@sendbird/chat-react-hooks';
import type { GroupChannelCreateFragment, UserListModule } from '@sendbird/uikit-react-native-core';
import { createUserListModule, useLocalization, useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { Logger } from '@sendbird/uikit-utils';

import UserSelectableBar from '../ui/UserSelectableBar';

const PassValue = <T,>(v: T) => v;

const DefaultUserIdGenerator = <T,>(users: T[]) => {
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
  initModule?: UserListModule<UserType>,
): GroupChannelCreateFragment<UserType> => {
  const UserListModule = createUserListModule<UserType>(initModule);

  return ({
    Header,
    userIdsGenerator = DefaultUserIdGenerator,
    onPressHeaderLeft,
    onBeforeCreateChannel = PassValue,
    onCreateChannel,
    sortComparator,
    queryCreator,
    renderUser,
    children,
  }) => {
    const { sdk } = useSendbirdChat();
    const { LABEL } = useLocalization();
    const { users, refreshing, refresh, next } = useUserList(sdk, {
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
              name={sbUser.nickname || LABEL.STRINGS.USER_NO_NAME}
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
        headerRight={(selectedUsers) => LABEL.GROUP_CHANNEL_CREATE.HEADER_RIGHT({ selectedUsers })}
        headerTitle={LABEL.GROUP_CHANNEL_CREATE.HEADER_TITLE}
      >
        <UserListModule.Header
          Header={Header}
          onPressHeaderLeft={onPressHeaderLeft}
          onPressHeaderRight={async (users) => {
            const params = new sdk.GroupChannelParams();
            params.isDistinct = true;
            params.addUserIds(userIdsGenerator(users));

            const processedParams = await onBeforeCreateChannel(params, users);
            const channel = await sdk.GroupChannel.createChannel(processedParams);
            onCreateChannel(channel);
          }}
        />
        <UserListModule.List
          onLoadNext={next}
          users={users}
          renderUser={_renderUser}
          onRefresh={refresh}
          refreshing={refreshing}
        />
        {children}
      </UserListModule.Provider>
    );
  };
};

export default createGroupChannelCreateFragment;
