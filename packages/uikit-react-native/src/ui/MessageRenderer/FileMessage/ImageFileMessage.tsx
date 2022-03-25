import React from 'react';
import { Image } from 'react-native';

import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { getAvailableUriFromFileMessage } from '@sendbird/uikit-utils';

import type { FileMessageProps } from './index';

const ImageFileMessage: React.FC<FileMessageProps> = ({ message }) => {
  const { colors } = useUIKitTheme();

  const fileUrl = getAvailableUriFromFileMessage(message);

  return (
    <Image
      source={{ uri: fileUrl }}
      style={[styles.image, { backgroundColor: colors.onBackground04 }]}
      resizeMode={'cover'}
      resizeMethod={'resize'}
    />
  );
};

const styles = createStyleSheet({
  image: {
    borderWidth: 1,
    width: 240,
    maxWidth: 240,
    height: 160,
    borderRadius: 16,
  },
});

export default ImageFileMessage;
