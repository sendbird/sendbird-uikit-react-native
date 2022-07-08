import React from 'react';
import { View } from 'react-native';

import { useLocalization } from '@sendbird/uikit-react-native-core';
import { Text, URLParsedText, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import type { UserMessageProps } from './index';

const BaseUserMessage: React.FC<UserMessageProps> = ({ message, variant, pressed }) => {
  const { colors } = useUIKitTheme();
  const color = colors.ui.message[variant][pressed ? 'pressed' : 'enabled'];
  const { STRINGS } = useLocalization();
  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <URLParsedText body3 strict color={color.textMsg}>
        {message.message}
        {Boolean(message.updatedAt) && (
          <Text body3 color={color.textEdited}>
            {STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_EDITED_POSTFIX}
          </Text>
        )}
      </URLParsedText>
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
