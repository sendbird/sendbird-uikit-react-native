

import {
  UserActionBar,
  UserListContextsType,
} from '@sendbird/uikit-react-native';
import { useBottomSheet } from '@sendbird/uikit-react-native-foundation';

/**
 *
 * {@link }
 * */
import React, { useState } from 'react';
import { useSendbirdChat, createGroupChannelMembersFragment } from '@sendbird/uikit-react-native';

const GroupChannelMembersFragment = createGroupChannelMembersFragment();
const GroupChannelMembersScreen = ({ params }: { params: { serializedChannel: object } }) => {
  const { sdk } = useSendbirdChat();
  const [channel] = useState(() => sdk.groupChannel.buildGroupChannelFromSerializedData(params.serializedChannel));

  const navigateToBack = () => {};
  const navigateToGroupChannelInvite = () => {};

  return (
    <GroupChannelMembersFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressHeaderRight={navigateToGroupChannelInvite}
    />
  );
};
/** ------------------ **/

/**
 *
 * {@link }
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
 *
 * {@link }
 * */
import { useContext } from 'react';
import { UserListContexts } from "@sendbird/uikit-react-native";

const Component = () => {
  const { headerTitle, headerRight } = useContext(UserListContexts.Fragment);
};
/** ------------------ **/

/**
 *
 * {@link }
 * */
// import { useContext } from 'react';
// import { UserListContexts } from "@sendbird/uikit-react-native";

const Component2 = () => {
  const { selectedUsers, setSelectedUsers } = useContext(UserListContexts.List);
};
/** ------------------ **/

/**
 *
 * {@link }
 * */
// import React, { useState } from 'react';
// import { useSendbirdChat, createGroupChannelMembersFragment, UserActionBar } from '@sendbird/uikit-react-native';
// import { useBottomSheet } from '@sendbird/uikit-react-native-foundation';

const GroupChannelMembersFragment2 = createGroupChannelMembersFragment();
const GroupChannelMembersScreen2 = ({ params }: { params: { serializedChannel: object } }) => {
  const { sdk } = useSendbirdChat();
  const [channel] = useState(() => sdk.groupChannel.buildGroupChannelFromSerializedData(params.serializedChannel));

  const { openSheet } = useBottomSheet();

  const navigateToBack = () => {};
  const navigateToGroupChannelInvite = () => {};

  return (
    <GroupChannelMembersFragment2
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressHeaderRight={navigateToGroupChannelInvite}
      renderUser={(user) => {
        return (
          <UserActionBar
            disabled={false}
            name={user.nickname}
            uri={user.profileUrl}
            muted={user.isMuted}
            onPressActionMenu={() => {
              openSheet({
                sheetItems: [
                  {
                    title: 'Ban',
                    titleColor: 'red',
                    onPress: () => channel.banUser(user, 30, 'ban'),
                  },
                  { title: 'Mute', onPress: () => channel.muteUser(user) },
                ],
              });
            }}
          />
        );
      }}
    />
  );
};
/** ------------------ **/
