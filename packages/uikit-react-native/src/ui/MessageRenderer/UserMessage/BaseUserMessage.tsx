import React from 'react';
import { View } from 'react-native';

import { Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import type { UserMessageProps } from './index';

const BaseUserMessage: React.FC<UserMessageProps> = ({ message, variant, pressed }) => {
  const { colors } = useUIKitTheme();
  const color = colors.ui.message[variant][pressed ? 'pressed' : 'enabled'];
  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Text body3 color={color.textMsg}>
        {message.message}
      </Text>
    </View>
  );
};
const styles = createStyleSheet({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
});

export default BaseUserMessage;
