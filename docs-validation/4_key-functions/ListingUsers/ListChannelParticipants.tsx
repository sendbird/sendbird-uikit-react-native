

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
import { useSendbirdChat, createOpenChannelParticipantsFragment } from '@sendbird/uikit-react-native';
import { useOpenChannel } from "@sendbird/uikit-chat-hooks";

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
import { UserListContexts } from "@sendbird/uikit-react-native";
import { Text } from "react-native";

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
// import { Text } from 'react-native';
// import React, { useState } from 'react';
// import { useSendbirdChat, createOpenChannelParticipantsFragment, UserActionBar } from '@sendbird/uikit-react-native';
// import { useBottomSheet } from '@sendbird/uikit-react-native-foundation';

const OpenChannelParticipantsFragment2 = createOpenChannelParticipantsFragment({
  Header: () => <Text>{'Custom Header'}</Text>,
  List: () => <Text>{'Custom List'}</Text>,
  StatusLoading: () => <Text>{'Custom Loading'}</Text>,
  StatusEmpty: () => <Text>{'Custom Empty'}</Text>,
  StatusError: () => <Text>{'Custom Error'}</Text>,
});
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
