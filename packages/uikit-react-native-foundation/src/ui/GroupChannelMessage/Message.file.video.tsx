import React from 'react';

import type { SendbirdFileMessage } from '@sendbird/uikit-utils';
import { getThumbnailUriFromFileMessage } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import PressBox from '../../components/PressBox';
import { VideoThumbnail } from '../../components/VideoThumbnail';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageContainer from './MessageContainer';
import type { GroupChannelMessageProps } from './index';

type Props = GroupChannelMessageProps<
  SendbirdFileMessage,
  { fetchThumbnailFromVideoSource: (uri: string) => Promise<{ path: string } | null> }
>;

const VideoFileMessage = (props: Props) => {
  const { onPress, onLongPress, variant = 'incoming' } = props;

  const { colors } = useUIKitTheme();
  const uri = getThumbnailUriFromFileMessage(props.message);

  return (
    <MessageContainer {...props}>
      <Box style={styles.container} backgroundColor={colors.ui.groupChannelMessage[variant].enabled.background}>
        <PressBox activeOpacity={0.8} onPress={onPress} onLongPress={onLongPress}>
          <VideoThumbnail
            style={styles.image}
            source={uri}
            fetchThumbnailFromVideoSource={props.fetchThumbnailFromVideoSource}
          />
        </PressBox>
        {props.children}
      </Box>
    </MessageContainer>
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
  playIcon: {
    padding: 10,
    borderRadius: 50,
  },
});
export default VideoFileMessage;
