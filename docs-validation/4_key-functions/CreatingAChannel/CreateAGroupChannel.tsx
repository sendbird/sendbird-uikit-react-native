import React, { useContext } from 'react';

import { CustomQuery } from '@sendbird/uikit-chat-hooks';
import { UserListContextsType, createGroupChannelCreateFragment } from '@sendbird/uikit-react-native';

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
// TODO: Generic SendbirdUser, params type
const GroupChannelCreateFragment = createGroupChannelCreateFragment<SendbirdUser>();
const GroupChannelCreateScreen1 = ({ params }) => {
  const navigateToBack = () => {};
  const replaceToGroupChannelScreen = () => {};
  const channelTypeFromGroupChannelListScreen = params.channelType;

  return (
    <GroupChannelCreateFragment
      onPressHeaderLeft={navigateToBack}
      onCreateChannel={replaceToGroupChannelScreen}
      channelType={channelTypeFromGroupChannelListScreen}
    />
  );
};
/** ------------------ **/

/**
 * Context
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-context}
 * */
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
// TODO: import useContext, UserListContexts
const { headerTitle, headerRight } = useContext(UserListContexts.Fragment);

/** ------------------ **/

/**
 * List
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-context-3-list}
 * */
// TODO: import useContext, UserListContexts
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

const GroupChannelCreateFragment2 = createGroupChannelCreateFragment<MyAppUser>();
// TODO: params type
const GroupChannelCreateScreen2 = ({ params }) => {
  const navigateToBack = () => {};
  const replaceToGroupChannelScreen = (channel) => {};
  const channelTypeFromGroupChannelListScreen = params.channelType;

  return (
    <GroupChannelCreateFragment2
      onPressHeaderLeft={navigateToBack}
      onCreateChannel={replaceToGroupChannelScreen}
      channelType={channelTypeFromGroupChannelListScreen}
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
