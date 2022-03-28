import React from 'react';
import { View } from 'react-native';

import { Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';

type Props = { message: SendbirdMessage; grouping: boolean };
const MessageIncomingSenderName: React.FC<Props> = ({ message, grouping }) => {
  const { colors } = useUIKitTheme();
  if (grouping) return null;

  return (
    <View style={styles.sender}>
      {(message.isFileMessage() || message.isUserMessage()) && (
        <Text caption1 color={colors.ui.message.incoming.enabled.textSenderName}>
          {message.sender?.nickname}
        </Text>
      )}
    </View>
  );
};

const styles = createStyleSheet({
  sender: {
    marginLeft: 12,
    marginBottom: 4,
  },
});

export default MessageIncomingSenderName;
