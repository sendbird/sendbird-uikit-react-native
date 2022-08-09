import React from 'react';
import { View } from 'react-native';

import { Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { useLocalization } from '../../../hooks/useContext';
import type { MessageRendererInterface } from '../index';

export type UnknownMessageProps = MessageRendererInterface;
const UnknownMessage = ({ message, variant, pressed }: UnknownMessageProps) => {
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();
  const color = colors.ui.message[variant][pressed ? 'pressed' : 'enabled'];
  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Text body3 color={colors.onBackground01}>
        {STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_UNKNOWN_TITLE(message)}
      </Text>
      <Text body3 color={colors.onBackground02}>
        {STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_UNKNOWN_DESC(message)}
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

export default UnknownMessage;
