import React, { useContext } from 'react';

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
import type { GroupChannelType, UserListContextsType } from "@sendbird/uikit-react-native";
import type { SendbirdUser } from '@sendbird/uikit-utils';

const GroupChannelCreateFragment = createGroupChannelCreateFragment<SendbirdUser>();
const GroupChannelCreateScreen = ({ params }: { params: { channelType: GroupChannelType } }) => {
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
import { UserListContexts } from "@sendbird/uikit-react-native";
const Component = () => {
  const { headerTitle, headerRight } = useContext(UserListContexts.Fragment);
}
/** ------------------ **/

/**
 * List
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-context-3-list}
 * */

const Component2 = () => {
  const { selectedUsers, setSelectedUsers } = useContext(UserListContexts.List);
}
/** ------------------ **/

/**
 * Customization
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-customization}
 * */
import { CustomQuery } from '@sendbird/uikit-chat-hooks';
import { createGroupChannelCreateFragment } from '@sendbird/uikit-react-native';

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
const GroupChannelCreateScreen2 = ({ params }: { params: { channelType: GroupChannelType } }) => {
  const navigateToBack = () => {};
  const replaceToGroupChannelScreen = () => {};
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
