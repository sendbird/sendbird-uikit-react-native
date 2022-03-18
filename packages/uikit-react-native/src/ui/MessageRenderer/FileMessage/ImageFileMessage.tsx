import React from 'react';
import { Image } from 'react-native';

import { createStyleSheet } from '@sendbird/uikit-react-native-foundation';

import type { FileMessageProps } from './index';

const ImageFileMessage: React.FC<FileMessageProps> = ({ message }) => {
  return <Image source={{ uri: message.url }} style={styles.image} resizeMode={'cover'} />;
};

const styles = createStyleSheet({
  image: {
    width: 240,
    height: 160,
    borderRadius: 16,
  },
});

export default ImageFileMessage;
