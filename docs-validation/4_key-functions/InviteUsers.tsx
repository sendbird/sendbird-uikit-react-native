import React  from "react";

const MyAppUserBar = (_: Record<string, unknown>) => <></>;
const createMyAppUserQuery = () => ({
  async next(): Promise<MyAppUser[]> {
    return [{ userId: '', name: '', profile: '' }];
  },
  isLoading: false,
  hasNext: false,
});

/**
 * Usage
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-usage}
 * */
import { useState } from 'react';
import { useSendbirdChat, createGroupChannelInviteFragment } from "@sendbird/uikit-react-native";
import type { SendbirdUser } from "@sendbird/uikit-utils";
import { useGroupChannel } from "@sendbird/uikit-chat-hooks";

const GroupChannelInviteFragment = createGroupChannelInviteFragment<SendbirdUser>();
const GroupChannelInviteScreen = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};
  const navigateToGroupChannel = () => {};

  return (
    <GroupChannelInviteFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onInviteMembers={navigateToGroupChannel}
    />
  );
};
/** ------------------ **/

/**
 * Context
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-context}
 * */
import type { UserListContextsType } from "@sendbird/uikit-react-native";

function _context<T>(_: UserListContextsType<T>) {
  const fragment = useContext(_.Fragment);
  fragment.headerTitle;
  fragment.headerRight;

  const list = useContext(_.List);
  list.selectedUsers;
  list.setSelectedUsers;
}
/** ------------------ **/

/**
 * Fragment
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-context-3-fragment}
 * */
import { useContext } from 'react';
import { UserListContexts } from "@sendbird/uikit-react-native";

const Component = () => {
  const { headerTitle, headerRight } = useContext(UserListContexts.Fragment);
};
/** ------------------ **/

/**
 * List
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-context-3-list}
 * */
// import { useContext } from 'react';
// import { UserListContexts } from "@sendbird/uikit-react-native";

const Component2 = () => {
  const { selectedUsers, setSelectedUsers } = useContext(UserListContexts.List);
};
/** ------------------ **/

/**
 * Customization
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-customization}
 * */
import { Text } from 'react-native';
import type { UserStruct } from '@sendbird/uikit-utils';
import { CustomQuery } from '@sendbird/uikit-chat-hooks';
// import { useSendbirdChat, createGroupChannelInviteFragment } from '@sendbird/uikit-react-native';
// import { useGroupChannel } from '@sendbird/uikit-chat-hooks';

interface MyAppUser extends UserStruct {
  userId: string;
  name: string;
  profile: string;
}

const myAppUserQueryCreator = () => {
  const query = createMyAppUserQuery();
  return new CustomQuery<MyAppUser>({
    hasNext(): boolean {
      return query.hasNext;
    },
    isLoading(): boolean {
      return query.isLoading;
    },
    next() {
      return query.next();
    },
  });
};

const GroupChannelInviteFragment2 = createGroupChannelInviteFragment<MyAppUser>({
  Header: () => <Text>{'Custom Header'}</Text>,
  List: () => <Text>{'Custom List'}</Text>,
  StatusLoading: () => <Text>{'Custom Loading'}</Text>,
  StatusEmpty: () => <Text>{'Custom Empty'}</Text>,
  StatusError: () => <Text>{'Custom Error'}</Text>,
});
const GroupChannelInviteScreen2 = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};
  const navigateToGroupChannel = () => {};

  return (
    <GroupChannelInviteFragment2
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onInviteMembers={navigateToGroupChannel}
      queryCreator={myAppUserQueryCreator}
      renderUser={(user, selectedUsers, setSelectedUsers) => {
        const selected = selectedUsers.findIndex((u) => u.userId === user.userId) > -1;
        return <MyAppUserBar selected={selected} user={user} onToggle={setSelectedUsers} />;
      }}
    />
  );
};
/** ------------------ **/
