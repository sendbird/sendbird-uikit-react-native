import React from 'react';
import { Pressable, View } from 'react-native';

import { Avatar, createStyleSheet } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';

import { useUserProfile } from '../../hooks/useContext';

type Props = {
  message: SendbirdMessage;
  grouping: boolean;
};
const MessageIncomingAvatar = ({ message, grouping }: Props) => {
  const { show } = useUserProfile();
  if (grouping) return <View style={styles.avatar} />;
  return (
    <View style={styles.avatar}>
      {(message.isFileMessage() || message.isUserMessage()) && (
        <Pressable onPress={() => show(message.sender)}>
          <Avatar size={26} uri={message.sender?.profileUrl} />
        </Pressable>
      )}
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
