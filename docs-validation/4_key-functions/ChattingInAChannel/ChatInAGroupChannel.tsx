import { GroupChannelContextsType, GroupChannelContexts } from '@sendbird/uikit-react-native';
import React, { useContext } from 'react';

const AdvertiseMessage = (_:object) => <></>

/**
 * Usage
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/chatting-in-a-channel/chat-in-a-group-channel#2-usage}
 * */
import { useSendbirdChat, createGroupChannelFragment } from '@sendbird/uikit-react-native';
import { useGroupChannel } from '@sendbird/uikit-chat-hooks';

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
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/chatting-in-a-channel/chat-in-a-group-channel#2-context}
 * */
function _context(_: GroupChannelContextsType) {
  const fragment = useContext(_.Fragment);
  fragment.headerTitle;
  fragment.keyboardAvoidOffset;
  fragment.channel;
  fragment.messageToEdit;
  fragment.setMessageToEdit;
  fragment.messageToReply;
  fragment.setMessageToReply;

  const typing = useContext(_.TypingIndicator);
  typing.typingUsers;
}
/** ------------------ **/

/**
 * Fragment
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/chatting-in-a-channel/chat-in-a-group-channel#2-context-3-fragment}
 * */
const Component = () => {
  const {
    headerTitle,
    keyboardAvoidOffset,
    channel,
    messageToEdit,
    setMessageToEdit,
    messageToReply,
    setMessageToReply,
  } = useContext(GroupChannelContexts.Fragment);
};
/** ------------------ **/

/**
 * TypingIndicator
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/chatting-in-a-channel/chat-in-a-group-channel#2-context-3-typeselector}
 * */
const Component2 = () => {
  const { typingUsers } = useContext(GroupChannelContexts.TypingIndicator);
};
/** ------------------ **/

/**
 * Customization
 * {@link https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/chatting-in-a-channel/chat-in-a-group-channel#2-customization}
 * */
import { Text } from 'react-native';
import { GroupChannelModule, GroupChannelMessageRenderer } from '@sendbird/uikit-react-native';

const CustomHeader: GroupChannelModule['Header'] = () => {
  return <Text>{'Custom Header'}</Text>;
};
const CustomMessageList: GroupChannelModule['MessageList'] = () => {
  return <Text>{'Custom MessageList'}</Text>;
};
const CustomInput: GroupChannelModule['Input'] = () => {
  return <Text>{'Custom Input'}</Text>;
};
const CustomEmpty: GroupChannelModule['StatusEmpty'] = () => {
  return <Text>{'Custom Empty'}</Text>;
};
const CustomLoading: GroupChannelModule['StatusLoading'] = () => {
  return <Text>{'Custom Loading'}</Text>;
};
const GroupChannelFragment2 = createGroupChannelFragment({
  Header: CustomHeader,
  MessageList: CustomMessageList,
  Input: CustomInput,
  StatusEmpty: CustomEmpty,
  StatusLoading: CustomLoading,
});
const GroupChannelScreen2 = ({ route: { params } }: any) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  const navigateToGroupChannelListScreen = () => {};
  const navigateToGroupChannelSettingsScreen = () => {};
  const navigateToBack = () => {};

  return (
    <GroupChannelFragment2
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
      // Apply query parameters for message list
      messageListQueryParams={{
        prevResultLimit: 20,
        customTypesFilter: ['filter']
      }}
    />
  );
};
/** ------------------ **/
