import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import type Sendbird from 'sendbird';

import { useUserList } from '@sendbird/chat-react-hooks';
import type { InviteMembersFragment, InviteMembersModule } from '@sendbird/uikit-react-native-core';
import { createInviteMembersModule, useSendbirdChat } from '@sendbird/uikit-react-native-core';

import UserListItem from '../ui/UserListItem';

const createInviteMembersFragment = <UserType,>(
  initModule?: InviteMembersModule<UserType>,
): InviteMembersFragment<UserType> => {
  const InviteMembersModule = createInviteMembersModule<UserType>(initModule);

  return ({ Header, onPressHeaderLeft, onPressInviteMembers, sortComparator, queryCreator, renderUser, children }) => {
    const { sdk } = useSendbirdChat();
    const { users, refreshing, refresh, next } = useUserList(sdk, {
      queryCreator,
      sortComparator,
    });

    const _renderUser: NonNullable<typeof renderUser> = useCallback(
      (user, selectedUsers, setSelectedUsers) => {
        if (queryCreator && !renderUser) throw new Error('You should provide renderUser when providing queryCreator');
        if (renderUser) return renderUser(user, selectedUsers, setSelectedUsers);

        const sbUser = user as unknown as Sendbird.User;
        const sbSelectedUsers = selectedUsers as unknown as Sendbird.User[];
        const sbSetSelectedUsers = setSelectedUsers as unknown as React.Dispatch<React.SetStateAction<Sendbird.User[]>>;

        const userIdx = sbSelectedUsers.findIndex((u) => u.userId === sbUser.userId);
        const isSelected = userIdx > -1;

        return (
          <Pressable
            onPress={() => {
              sbSetSelectedUsers(([...draft]) => {
                if (isSelected) draft.splice(userIdx, 1);
                else draft.push(sbUser);
                return draft;
              });
            }}
          >
            <UserListItem uri={sbUser.profileUrl} name={sbUser.nickname || '(No name)'} selected={isSelected} />
          </Pressable>
        );
      },
      [renderUser, queryCreator],
    );
    return (
      <InviteMembersModule.Provider>
        <InviteMembersModule.Header
          Header={Header}
          onPressHeaderLeft={onPressHeaderLeft}
          onPressInviteMembers={onPressInviteMembers}
        />
        <InviteMembersModule.List
          onLoadNext={next}
          users={users}
          renderUser={_renderUser}
          onRefresh={refresh}
          refreshing={refreshing}
        />
        {children}
      </InviteMembersModule.Provider>
    );
  };
};

export default createInviteMembersFragment;
