import React, { useContext } from 'react';

import {
  UserActionBar,
  UserListContextsType,
  createGroupChannelMembersFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native';
import { useBottomSheet } from '@sendbird/uikit-react-native-foundation';

/**
 *
 * {@link }
 * */
// TODO: params type, import useState, sdk.groupChannel
const GroupChannelMembersFragment = createGroupChannelMembersFragment();
const GroupChannelMembersScreen = ({ params }) => {
  const { sdk } = useSendbirdChat();
  const [channel] = useState(() => sdk.GroupChannel.buildFromSerializedData(params.serializedChannel));

  const navigateToBack = () => {};
  const navigateToGroupChannelInvite = () => {};

  return (
    <GroupChannelMembersFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      // TODO: onInviteMembers -> onPressHeaderRight
      onInviteMembers={navigateToGroupChannelInvite}
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
  _fragment.headerTitle;
  _fragment.headerRight;

  const list = useContext(_.List);
  _list.selectedUsers;
  _list.setSelectedUsers;
}
/** ------------------ **/

/**
 *
 * {@link }
 * */
// TODO: import useContext, UserListContexts
const { headerTitle, headerRight } = useContext(UserListContexts.Fragment);
/** ------------------ **/

/**
 *
 * {@link }
 * */
// TODO: import useContext, UserListContexts
const { selectedUsers, setSelectedUsers } = useContext(UserListContexts.List);
/** ------------------ **/

/**
 *
 * {@link }
 * */
// TODO: params type, remove MyAppUser generic, import useState
const GroupChannelMembersFragment2 = createGroupChannelMembersFragment();
const GroupChannelMembersScreen2 = ({ params }) => {
  const { sdk } = useSendbirdChat();
  const [channel] = useState(() => sdk.GroupChannel.buildFromSerializedData(params.serializedChannel));

  const { openSheet } = useBottomSheet();

  const navigateToBack = () => {};
  const navigateToGroupChannelInvite = () => {};

  return (
    <GroupChannelMembersFragment2
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      // TODO: onInviteMembers -> onPressHeaderRight
      onInviteMembers={navigateToGroupChannelInvite}
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
