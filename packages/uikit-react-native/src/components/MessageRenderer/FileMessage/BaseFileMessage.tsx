import React from 'react';
import { View } from 'react-native';

import { Icon, Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { useLocalization } from '../../../hooks/useContext';
import type { FileMessageProps } from './index';

const iconMapper = { audio: 'file-audio', image: 'photo', video: 'play', file: 'file-document' } as const;

const BaseFileMessage: React.FC<FileMessageProps & { type: 'image' | 'audio' | 'video' | 'file' }> = ({
  message,
  variant,
  pressed,
  type,
}) => {
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();
  const color = colors.ui.message[variant][pressed ? 'pressed' : 'enabled'];
  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Icon
        icon={iconMapper[type]}
        size={24}
        containerStyle={{ backgroundColor: colors.background, padding: 2, borderRadius: 8, marginRight: 8 }}
      />
      <Text body3 ellipsizeMode={'middle'} numberOfLines={1} color={color.textMsg} style={styles.name}>
        {STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_FILE_TITLE(message)}
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
  name: {
    flexShrink: 1,
  },
});

export default BaseFileMessage;
