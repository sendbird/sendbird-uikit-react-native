import React from 'react';

import type { SendbirdFileMessage } from '@sendbird/uikit-utils';
import { getThumbnailUriFromFileMessage } from '@sendbird/uikit-utils';

import PressBox from '../../components/PressBox';
import { VideoThumbnail } from '../../components/VideoThumbnail';
import createStyleSheet from '../../styles/createStyleSheet';
import MessageContainer from './MessageContainer';
import type { OpenChannelMessageProps } from './index';

type Props = {
  fetchThumbnailFromVideoSource: (uri: string) => Promise<{ path: string } | null>;
};

const VideoFileMessage = (props: OpenChannelMessageProps<SendbirdFileMessage, Props>) => {
  const { onPress, onLongPress, ...rest } = props;
  const uri = getThumbnailUriFromFileMessage(props.message);

  return (
    <MessageContainer {...rest}>
      <PressBox style={styles.container} activeOpacity={0.8} onPress={onPress} onLongPress={onLongPress}>
        <VideoThumbnail
          style={styles.container}
          source={uri}
          fetchThumbnailFromVideoSource={props.fetchThumbnailFromVideoSource}
        />
      </PressBox>
    </MessageContainer>
  );
};

const styles = createStyleSheet({
  container: {
    maxWidth: 296,
    height: 196,
    borderRadius: 8,
    overflow: 'hidden',
  },
  iconContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  playIcon: {
    padding: 10,
    borderRadius: 50,
  },
});
export default VideoFileMessage;
