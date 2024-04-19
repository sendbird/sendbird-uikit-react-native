

import {
  UserActionBar,
  UserListContextsType,
} from '@gathertown/uikit-react-native';
import { useBottomSheet } from '@gathertown/uikit-react-native-foundation';

/**
 *
 * {@link }
 * */
import React, { useState } from 'react';
import { useSendbirdChat, createOpenChannelParticipantsFragment } from '@gathertown/uikit-react-native';
import { useOpenChannel } from "@gathertown/uikit-chat-hooks";

const OpenChannelParticipantsFragment = createOpenChannelParticipantsFragment();
const OpenChannelParticipantsScreen = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};

  return (
    <OpenChannelParticipantsFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
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
import { UserListContexts } from "@gathertown/uikit-react-native";

const Component = () => {
  const { headerTitle, headerRight } = useContext(UserListContexts.Fragment);
};
/** ------------------ **/

/**
 *
 * {@link }
 * */
// import { useContext } from 'react';
// import { UserListContexts } from "@gathertown/uikit-react-native";

const Component2 = () => {
  const { selectedUsers, setSelectedUsers } = useContext(UserListContexts.List);
};
/** ------------------ **/

/**
 *
 * {@link }
 * */
// import React, { useState } from 'react';
// import { useSendbirdChat, createOpenChannelParticipantsFragment, UserActionBar } from '@gathertown/uikit-react-native';
// import { useBottomSheet } from '@gathertown/uikit-react-native-foundation';

const OpenChannelParticipantsFragment2 = createOpenChannelParticipantsFragment();
const OpenChannelParticipantsScreen2 = ({ route: { params } }: any) => {
  const { openSheet } = useBottomSheet();

  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};

  return (
    <OpenChannelParticipantsFragment2
      channel={channel}
      onPressHeaderLeft={navigateToBack}
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
