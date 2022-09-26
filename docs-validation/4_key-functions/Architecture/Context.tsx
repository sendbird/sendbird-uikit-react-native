import { useContext } from 'react';

/**
 * How to use context
 * {@link https://sendbird.com/docs/uikit/v3/react-native/key-functions/architecture/context#2-how-to-use-context}
 * */
// TODO: naming Context -> Context's'
// TODO: import Text, GroupChannelContexts
const CustomTypingUsersComponent = () => {
  const { typingUsers } = useContext(GroupChannelContext.TypingIndicator);
  if (typingUsers.length === 0) return null;
  return <Text>{`several people are typings (${typingUsers.length})`}</Text>;
};
/** ------------------ **/
