import React from 'react';

import { Box, PressBox, VideoThumbnail, createStyleSheet } from '@sendbird/uikit-react-native-foundation';
import { SendbirdFileMessage, getThumbnailUriFromFileMessage } from '@sendbird/uikit-utils';

import { ThreadParentMessageRendererProps } from './index';

type Props = ThreadParentMessageRendererProps<{
  fetchThumbnailFromVideoSource: (uri: string) => Promise<{ path: string } | null>;
}>;

const ThreadParentMessageFileVideo = (props: Props) => {
  const fileMessage: SendbirdFileMessage = props.parentMessage as SendbirdFileMessage;
  if (!fileMessage) return null;

  const uri = getThumbnailUriFromFileMessage(fileMessage);

  return (
    <Box style={styles.container}>
      <PressBox activeOpacity={0.8} onPress={props.onPress} onLongPress={props.onLongPress}>
        <VideoThumbnail
          style={styles.image}
          source={uri}
          fetchThumbnailFromVideoSource={props.fetchThumbnailFromVideoSource}
        />
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

export default ThreadParentMessageFileVideo;
