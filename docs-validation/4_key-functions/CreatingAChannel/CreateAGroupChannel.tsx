import React, { useContext } from 'react';

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
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-usage}
 * */
import type { GroupChannelType, UserListContextsType } from "@gathertown/uikit-react-native";
import type { SendbirdUser } from '@gathertown/uikit-utils';

const GroupChannelCreateFragment = createGroupChannelCreateFragment<SendbirdUser>();
const GroupChannelCreateScreen = ({ route: { params } }: any) => {
  const navigateToBack = () => {};
  const replaceToGroupChannelScreen = () => {};
  const channelTypeFromGroupChannelListScreen = params.channelType as GroupChannelType;

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
import { UserListContexts } from "@gathertown/uikit-react-native";
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
import type { UserStruct } from '@gathertown/uikit-utils';
import { CustomQuery } from '@gathertown/uikit-chat-hooks';
import { createGroupChannelCreateFragment } from '@gathertown/uikit-react-native';

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

const GroupChannelCreateFragment2 = createGroupChannelCreateFragment<MyAppUser>();
const GroupChannelCreateScreen2 = ({ route: { params } }: any) => {
  const navigateToBack = () => {};
  const replaceToGroupChannelScreen = () => {};
  const channelTypeFromGroupChannelListScreen = params.channelType as GroupChannelType;

  return (
    <GroupChannelCreateFragment2
      onPressHeaderLeft={navigateToBack}
      onCreateChannel={replaceToGroupChannelScreen}
      channelType={channelTypeFromGroupChannelListScreen}
      queryCreator={myAppUserQueryCreator}
      renderUser={(user, selectedUsers, setSelectedUsers) => {
        const selected = selectedUsers.findIndex((u) => u.userId === user.userId) > -1;
        return <MyAppUserBar selected={selected} user={user} onToggle={setSelectedUsers} />;
      }}
    />
  );
};
/** ------------------ **/
