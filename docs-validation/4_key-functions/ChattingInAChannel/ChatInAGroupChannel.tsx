import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useLayoutEffect } from 'react';
import { Pressable } from 'react-native';

import { GroupChannelContextsType, createGroupChannelFragment, useSendbirdChat } from '@sendbird/uikit-react-native';
import { GroupChannelContexts, GroupChannelModule } from '@sendbird/uikit-react-native';
import { Icon } from '@sendbird/uikit-react-native-foundation';

/**
 *
 * {@link }
 * */
const GroupChannelFragment = createGroupChannelFragment();
//TODO: params type, import useState, sdk.groupChannel
const GroupChannelScreen = ({ params }: { params: object }) => {
  const { sdk } = useSendbirdChat();
  const [channel] = useState(() => sdk.GroupChannel.buildFromSerializedData(params.serializedChannel));

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
  _fragment.headerTitle;
  _fragment.channel;
  _fragment.editMessage;
  _fragment.setEditMessage;
  _fragment.keyboardAvoidOffset;

  const typing = useContext(_.TypingIndicator);
  _typing.typingUsers;
}
/** ------------------ **/

/**
 * Fragment
 * {@link }
 * */
const { headerTitle, channel, editMessage, setEditMessage, keyboardAvoidOffset } = useContext(
  GroupChannelContexts.Fragment,
);
/** ------------------ **/

/**
 * TypingIndicator
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/chatting-in-a-channel/chat-in-a-group-channel#2-context-3-typeselector}
 * */
// TODO: GroupChannelListContexts.TypeSelector -> GroupChannelContexts.TypingIndicator
const { typingUsers } = useContext(GroupChannelContexts.TypingIndicator);
/** ------------------ **/

/**
 *
 * {@link }
 * */
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
  Header: UseReactNavigationHeader,
});
// TODO: params type object, useState, sdk.groupChannel
const GroupChannelScreen = ({ params }: { params: object }) => {
  const { sdk } = useSendbirdChat();
  const [channel] = useState(() => sdk.GroupChannel.buildFromSerializedData(params.serializedChannel));

  const navigateToGroupChannelListScreen = () => {};
  const navigateToGroupChannelSettingsScreen = () => {};
  const navigateToBack = () => {};

  const height = useHeaderHeight();

  return (
    <GroupChannelFragment2
      keyboardAvoidOffset={height}
      channel={channel}
      onPressHeaderLeft={navigateToBack}
      onPressHeaderRight={navigateToGroupChannelSettingsScreen}
      onChannelDeleted={navigateToGroupChannelListScreen}
    />
  );
};

/** ------------------ **/
