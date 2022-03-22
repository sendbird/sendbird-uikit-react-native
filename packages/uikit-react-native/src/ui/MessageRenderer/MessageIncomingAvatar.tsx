import React from 'react';
import { View } from 'react-native';

import { Avatar, createStyleSheet } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';

type Props = { message: SendbirdMessage; grouping: boolean };
const MessageIncomingAvatar: React.FC<Props> = ({ message, grouping }) => {
  if (grouping) return <View style={styles.avatar} />;
  return (
    <View style={styles.avatar}>
      {(message.isFileMessage() || message.isUserMessage()) && <Avatar size={26} uri={message.sender?.profileUrl} />}
    </View>
  );
};

const styles = createStyleSheet({
  avatar: {
    width: 26,
    marginRight: 12,
  },
});

export default MessageIncomingAvatar;
