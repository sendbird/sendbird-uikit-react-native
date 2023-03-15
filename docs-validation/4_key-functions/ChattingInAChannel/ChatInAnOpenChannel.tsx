import type { OpenChannelContextsType } from '@sendbird/uikit-react-native';

const DonationMessage = (_:object) => <></>

/**
 * Usage
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/chatting-in-a-channel/chat-in-an-open-channel#2-usage}
 * */
import { useSendbirdChat, createOpenChannelFragment } from "@sendbird/uikit-react-native";
import { useOpenChannel } from "@sendbird/uikit-chat-hooks";

const OpenChannelFragment = createOpenChannelFragment();

const OpenChannelScreen = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};
  const navigateToOpenChannelList = () => {};
  const navigateToOpenChannelParticipants = () => {};
  const navigateToOpenChannelSettings = () => {};

  return (
    <OpenChannelFragment
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressHeaderRightWithSettings={navigateToOpenChannelSettings}
      onPressHeaderRightWithParticipants={navigateToOpenChannelParticipants}
      onChannelDeleted={navigateToOpenChannelList}
    />
  );
};
/** ------------------ **/

/**
 * Context
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/chatting-in-a-channel/chat-in-a-group-channel#2-context}
 * */
function _context(_: OpenChannelContextsType) {
  const fragment = useContext(_.Fragment);
  fragment.headerTitle;
  fragment.channel;
  fragment.messageToEdit;
  fragment.setMessageToEdit;
  fragment.keyboardAvoidOffset;
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
  } = useContext(OpenChannelContexts.Fragment);
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

import { OpenChannelContexts, OpenChannelModule, OpenChannelMessageRenderer } from '@sendbird/uikit-react-native';
import { Icon } from '@sendbird/uikit-react-native-foundation';
// import { useOpenChannel } from "@sendbird/uikit-chat-hooks";

const UseReactNavigationHeader: OpenChannelModule['Header'] = ({ rightIconName, onPressHeaderRight, onPressHeaderLeft }) => {
  const navigation = useNavigation();
  const { headerTitle } = useContext(OpenChannelContexts.Fragment);

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
          <Icon icon={rightIconName} />
        </Pressable>
      ),
    });
  }, []);

  return null;
};

const OpenChannelFragment2 = createOpenChannelFragment({
  Header: UseReactNavigationHeader, // Hide header and use react-navigation header
});
const OpenChannelScreen2 = ({ route: { params } }: any) => {
  const height = useHeaderHeight();

  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};
  const navigateToOpenChannelList = () => {};
  const navigateToOpenChannelParticipants = () => {};
  const navigateToOpenChannelSettings = () => {};

  return (
    <OpenChannelFragment2
      keyboardAvoidOffset={height}
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressHeaderRightWithSettings={navigateToOpenChannelSettings}
      onPressHeaderRightWithParticipants={navigateToOpenChannelParticipants}
      onChannelDeleted={navigateToOpenChannelList}
      // Render custom message
      renderMessage={(props) => {
        if(props.message.customType === 'donation') {
          return <DonationMessage {...props} />
        }
        return <OpenChannelMessageRenderer {...props} />
      }}
    />
  );
};
/** ------------------ **/
