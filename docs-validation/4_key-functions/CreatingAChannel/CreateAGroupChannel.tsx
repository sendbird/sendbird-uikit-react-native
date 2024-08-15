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
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-usage}
 * */
import type { GroupChannelType, UserListContextsType } from '@sendbird/uikit-react-native';
import type { SendbirdUser } from '@sendbird/uikit-utils';

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
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-context}
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
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-context-3-fragment}
 * */
import { UserListContexts } from '@sendbird/uikit-react-native';
const Component = () => {
  const { headerTitle, headerRight } = useContext(UserListContexts.Fragment);
}
/** ------------------ **/

/**
 * List
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-context-3-list}
 * */

const Component2 = () => {
  const { selectedUsers, setSelectedUsers } = useContext(UserListContexts.List);
}
/** ------------------ **/

/**
 * Customization
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/creating-a-channel/create-a-group-channel#2-customization}
 * */
import { Text } from 'react-native';
import type { UserStruct } from '@sendbird/uikit-utils';
import { CustomQuery } from '@sendbird/uikit-chat-hooks';
import { createGroupChannelCreateFragment } from '@sendbird/uikit-react-native';

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

const GroupChannelCreateFragment2 = createGroupChannelCreateFragment<MyAppUser>({
  Header: () => <Text>{'Custom header'}</Text>,
  List: () => <Text>{'Custom list'}</Text>,
  StatusEmpty: () => <Text>{'Custom empty'}</Text>,
  StatusLoading: () => <Text>{'Custom loading'}</Text>,
  StatusError: () => <Text>{'Custom error'}</Text>,
});
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
