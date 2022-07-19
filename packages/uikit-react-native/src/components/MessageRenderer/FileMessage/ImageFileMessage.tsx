import React, { useState } from 'react';

import { Icon, Image, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { getAvailableUriFromFileMessage } from '@sendbird/uikit-utils';

import type { FileMessageProps } from './index';

const ImageFileMessage: React.FC<FileMessageProps> = ({ message }) => {
  const { colors } = useUIKitTheme();
  const [imageNotFound, setImageNotFound] = useState(false);

  const fileUrl = getAvailableUriFromFileMessage(message);
  const style = [styles.image, { backgroundColor: colors.onBackground04 }];

  if (imageNotFound) {
    return <Icon containerStyle={style} icon={'thumbnail-none'} size={48} color={colors.onBackground02} />;
  }

  return (
    <Image
      source={{ uri: fileUrl }}
      style={style}
      resizeMode={'cover'}
      resizeMethod={'resize'}
      onError={() => setImageNotFound(true)}
    />
  );
};

const styles = createStyleSheet({
  image: {
    width: 240,
    maxWidth: 240,
    height: 160,
    borderRadius: 16,
  },
});

export default ImageFileMessage;
