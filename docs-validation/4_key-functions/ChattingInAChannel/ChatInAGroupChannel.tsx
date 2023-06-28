import type { GroupChannelContextsType } from '@sendbird/uikit-react-native';

const AdvertiseMessage = (_:object) => <></>

/**
 * Usage
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/chatting-in-a-channel/chat-in-a-group-channel#2-usage}
 * */
import { useSendbirdChat, createGroupChannelFragment } from "@sendbird/uikit-react-native";
import { useGroupChannel } from "@sendbird/uikit-chat-hooks";

const GroupChannelFragment = createGroupChannelFragment();

const GroupChannelScreen = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToGroupChannelListScreen = () => {};
  const navigateToGroupChannelSettingsScreen = () => {};
  const navigateToBack = () => {};

  return (
    <GroupChannelFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressHeaderRight={navigateToGroupChannelSettingsScreen}
      onChannelDeleted={navigateToGroupChannelListScreen}
    />
  );
};
/** ------------------ **/

/**
 * Context
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/chatting-in-a-channel/chat-in-a-group-channel#2-context}
 * */
function _context(_: GroupChannelContextsType) {
  const fragment = useContext(_.Fragment);
  fragment.headerTitle;
  fragment.channel;
  fragment.messageToEdit;
  fragment.setMessageToEdit;
  fragment.keyboardAvoidOffset;

  const typing = useContext(_.TypingIndicator);
  typing.typingUsers;
}
/** ------------------ **/

/**
 * Fragment
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/chatting-in-a-channel/chat-in-a-group-channel#2-context-3-fragment}
 * */
const Component = () => {
  const {
    headerTitle,
    channel,
    messageToEdit,
    setMessageToEdit,
    keyboardAvoidOffset,
  } = useContext(GroupChannelContexts.Fragment);
};
/** ------------------ **/

/**
 * TypingIndicator
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/chatting-in-a-channel/chat-in-a-group-channel#2-context-3-typeselector}
 * */
const Component2 = () => {
  const { typingUsers } = useContext(GroupChannelContexts.TypingIndicator);
};
/** ------------------ **/

/**
 * Customization
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/chatting-in-a-channel/chat-in-a-group-channel#2-customization}
 * */
import React, { useContext, useLayoutEffect } from 'react';
import { Pressable } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';

import { GroupChannelContexts, GroupChannelModule, GroupChannelMessageRenderer } from '@sendbird/uikit-react-native';
import { Icon } from '@sendbird/uikit-react-native-foundation';

const UseReactNavigationHeader: GroupChannelModule['Header'] = ({ onPressHeaderRight, onPressHeaderLeft }) => {
  const navigation = useNavigation();
  const { headerTitle } = useContext(GroupChannelContexts.Fragment);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: headerTitle,
      headerLeft: () => (
        <Pressable onPress={onPressHeaderLeft}>
          <Icon icon={'arrow-left'} />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={onPressHeaderRight}>
          <Icon icon={'info'} />
        </Pressable>
      ),
    });
  }, []);

  return null;
};

const GroupChannelFragment2 = createGroupChannelFragment({
  Header: UseReactNavigationHeader, // Hide header and use react-navigation header
});
const GroupChannelScreen2 = ({ route: { params } }: any) => {
  const height = useHeaderHeight();

  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToGroupChannelListScreen = () => {};
  const navigateToGroupChannelSettingsScreen = () => {};
  const navigateToBack = () => {};

  return (
    <GroupChannelFragment2
      keyboardAvoidOffset={height}
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressHeaderRight={navigateToGroupChannelSettingsScreen}
      onChannelDeleted={navigateToGroupChannelListScreen}
      // Render custom message
      renderMessage={(props) => {
        if(props.message.customType === 'Advertise') {
          return <AdvertiseMessage {...props} />
        }
        return <GroupChannelMessageRenderer {...props} />
      }}
    />
  );
};
/** ------------------ **/
