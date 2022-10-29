import React  from "react";

const MyAppUserBar = (_: Record<string, unknown>) => <></>;
const createMyAppUserQuery = () => ({
  async next(): Promise<MyAppUser[]> {
    return [{ uid: '', name: '', profile: '' }];
  },
  isLoading: false,
  hasNext: false,
});

/**
 * Usage
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-usage}
 * */
import { useState } from 'react';
import { useSendbirdChat, createGroupChannelInviteFragment } from "@sendbird/uikit-react-native";
import type { SendbirdUser } from "@sendbird/uikit-utils";
import { useGroupChannel } from "@sendbird/uikit-chat-hooks";

const GroupChannelInviteFragment = createGroupChannelInviteFragment<SendbirdUser>();
const GroupChannelInviteScreen = ({ params }: { params: { channelUrl: string } }) => {
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
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-context}
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
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-context-3-fragment}
 * */
import { useContext } from 'react';
import { UserListContexts } from "@sendbird/uikit-react-native";

const Component = () => {
  const { headerTitle, headerRight } = useContext(UserListContexts.Fragment);
};
/** ------------------ **/

/**
 * List
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-context-3-list}
 * */
// import { useContext } from 'react';
// import { UserListContexts } from "@sendbird/uikit-react-native";

const Component2 = () => {
  const { selectedUsers, setSelectedUsers } = useContext(UserListContexts.List);
};
/** ------------------ **/

/**
 * Customization
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-customization}
 * */
import { CustomQuery } from '@sendbird/uikit-chat-hooks';
// import { useSendbirdChat, createGroupChannelInviteFragment } from '@sendbird/uikit-react-native';
// import { useGroupChannel } from '@sendbird/uikit-chat-hooks';

type MyAppUser = { uid: string; name: string; profile: string };

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

const GroupChannelInviteFragment2 = createGroupChannelInviteFragment<MyAppUser>();
const GroupChannelInviteScreen2 = ({ params }: { params: { channelUrl: string } }) => {
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
      userIdsGenerator={(users) => users.map((u) => u.uid)}
      renderUser={(user, selectedUsers, setSelectedUsers) => {
        const selected = selectedUsers.findIndex((u) => u.uid === user.uid) > -1;
        return <MyAppUserBar selected={selected} user={user} onToggle={setSelectedUsers} />;
      }}
    />
  );
};
/** ------------------ **/
