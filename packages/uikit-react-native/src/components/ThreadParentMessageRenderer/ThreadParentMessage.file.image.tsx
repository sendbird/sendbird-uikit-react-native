import React from 'react';
import { getThumbnailUriFromFileMessage, SendbirdFileMessage } from '@sendbird/uikit-utils';
import { Box, createStyleSheet, PressBox } from '@sendbird/uikit-react-native-foundation';

import { ThreadParentMessageRendererProps } from './index';
import { ImageWithPlaceholder } from '@sendbird/uikit-react-native-foundation';

const ThreadParentMessageFileImage = (props: ThreadParentMessageRendererProps) => {
  const fileMessage: SendbirdFileMessage = props.parentMessage as SendbirdFileMessage;
  if (!fileMessage) return null;
  
  return (
    <Box style={styles.container}>
      <PressBox onPress={props.onPress} onLongPress={props.onLongPress}>
        <ImageWithPlaceholder source={{ uri: getThumbnailUriFromFileMessage(fileMessage) }} style={styles.image} />
      </PressBox>
    </Box>
  );
};

const styles = createStyleSheet({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    maxWidth: 240,
    width: 240,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
  },
});

export default ThreadParentMessageFileImage;
