/**
 * How to use context
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/architecture/context#2-how-to-use-context}
 * */
import React, { useContext } from 'react';
import { Text } from 'react-native';
import { GroupChannelContexts } from '@gathertown/uikit-react-native';

const CustomTypingUsersComponent = () => {
  const { typingUsers } = useContext(GroupChannelContexts.TypingIndicator);
  if (typingUsers.length === 0) return null;
  return <Text>{`several people are typing (${typingUsers.length})`}</Text>;
};
/** ------------------ **/
