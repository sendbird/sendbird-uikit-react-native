import React from 'react';

import { CustomQuery } from '@sendbird/uikit-chat-hooks';
import { createGroupChannelInviteFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

const MyAppUserBar = (_: Record<string, unknown>) => <></>;
const createMyAppUserQuery = () => ({
  async next(): Promise<MyAppUser> {
    return { uid: '', name: '', profile: '' };
  },
  isLoading: false,
  hasNext: false,
});

/**
 * Usage
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-usage}
 * */
// TODO: import useState, params type, SendbirdUser, sdk.groupChannel
const GroupChannelInviteFragment = createGroupChannelInviteFragment<SendbirdUser>();
const GroupChannelInviteScreen = ({ params }) => {
  const { sdk } = useSendbirdChat();
  const [channel] = useState(() => sdk.GroupChannel.buildFromSerializedData(params.serializedChannel));

  const navigateToBack = () => {};
  const navigateToGroupChannel = (channel) => {};

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
// TODO: import UserListContextsType, useContext
function _context<T>(_: UserListContextsType<T>) {
  const fragment = useContext(_.Fragment);
  _fragment.headerTitle;
  _fragment.headerRight;

  const list = useContext(_.List);
  _list.selectedUsers;
  _list.setSelectedUsers;
}
/** ------------------ **/

/**
 * Fragment
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-context-3-fragment}
 * */
// TODO: import UserListContexts, useContext
const { headerTitle, headerRight } = useContext(UserListContexts.Fragment);

/** ------------------ **/

/**
 * List
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-context-3-list}
 * */
// TODO: import UserListContexts, useContext
const { selectedUsers, setSelectedUsers } = useContext(UserListContexts.List);

/** ------------------ **/

/**
 * Customization
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-customization}
 * */
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
// TODO: import useState, params type, sdk.groupChannel
const GroupChannelInviteFragment2 = createGroupChannelInviteFragment<MyAppUser>();
const GroupChannelInviteScreen2 = ({ params }) => {
  const { sdk } = useSendbirdChat();
  const [channel] = useState(() => sdk.GroupChannel.buildFromSerializedData(params.serializedChannel));

  const navigateToBack = () => {};
  const navigateToGroupChannel = (channel) => {};

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
