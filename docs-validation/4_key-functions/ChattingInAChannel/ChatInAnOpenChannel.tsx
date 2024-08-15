import { OpenChannelContextsType, OpenChannelContexts } from '@sendbird/uikit-react-native';
import React, { useContext } from 'react';

const DonationMessage = (_:object) => <></>

/**
 * Usage
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/chatting-in-a-channel/chat-in-an-open-channel#2-usage}
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
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/chatting-in-a-channel/chat-in-a-group-channel#2-context}
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
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/chatting-in-a-channel/chat-in-a-group-channel#2-context-3-fragment}
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
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/chatting-in-a-channel/chat-in-a-group-channel#2-customization}
 * */
import { Text } from 'react-native';
import { OpenChannelModule, OpenChannelMessageRenderer } from '@sendbird/uikit-react-native';
// import { useOpenChannel } from "@sendbird/uikit-chat-hooks";

const CustomHeader: OpenChannelModule['Header'] = () => {
  return <Text>{'Custom Header'}</Text>;
};
const CustomInput: OpenChannelModule['Input'] = () => {
  return <Text>{'Custom Input'}</Text>;
};
const CustomMessageList: OpenChannelModule['MessageList'] = () => {
  return <Text>{'Custom MessageList'}</Text>;
};
const CustomEmpty: OpenChannelModule['StatusEmpty'] = () => {
  return <Text>{'Custom Empty'}</Text>;
};
const CustomLoading: OpenChannelModule['StatusLoading'] = () => {
  return <Text>{'Custom Loading'}</Text>;
};

const OpenChannelFragment2 = createOpenChannelFragment({
  Header: CustomHeader,
  Input: CustomInput,
  MessageList: CustomMessageList,
  StatusEmpty: CustomEmpty,
  StatusLoading: CustomLoading,
});
const OpenChannelScreen2 = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToBack = () => {};
  const navigateToOpenChannelList = () => {};
  const navigateToOpenChannelParticipants = () => {};
  const navigateToOpenChannelSettings = () => {};

  return (
    <OpenChannelFragment2
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
