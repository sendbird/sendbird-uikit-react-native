import React from 'react';
import { View } from 'react-native';

import { Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';

import { useLocalization } from '../../hooks/useContext';

type Props = {
  message: SendbirdMessage;
  grouping: boolean;
};
const MessageIncomingSenderName = ({ message, grouping }: Props) => {
  const { colors } = useUIKitTheme();
  const { STRINGS } = useLocalization();
  if (grouping) return null;

  return (
    <View style={styles.sender}>
      {(message.isFileMessage() || message.isUserMessage()) && (
        <Text caption1 color={colors.ui.message.incoming.enabled.textSenderName} numberOfLines={1}>
          {message.sender?.nickname || STRINGS.LABELS.USER_NO_NAME}
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
