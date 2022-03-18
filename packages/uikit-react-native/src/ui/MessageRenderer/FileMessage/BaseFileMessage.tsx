import React from 'react';
import { View } from 'react-native';

import { Icon, Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import type { FileMessageProps } from './index';

const iconMapper = { audio: 'file-audio', image: 'photo', video: 'streaming', file: 'file-document' } as const;

const BaseFileMessage: React.FC<FileMessageProps & { type: 'image' | 'audio' | 'video' | 'file' }> = ({
  message,
  variant,
  pressed,
  type,
}) => {
  const { colors } = useUIKitTheme();
  const color = colors.ui.message[variant][pressed ? 'pressed' : 'enabled'];
  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Icon
        icon={iconMapper[type]}
        size={24}
        containerStyle={{ backgroundColor: colors.background, padding: 2, borderRadius: 8, marginRight: 8 }}
      />
      <Text numberOfLines={1} body3 color={color.textMsg}>
        {message.name}
      </Text>
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
});

export default BaseFileMessage;
