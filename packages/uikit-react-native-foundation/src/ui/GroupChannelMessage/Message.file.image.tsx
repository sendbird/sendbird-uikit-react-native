import React from 'react';

import type { SendbirdFileMessage } from '@sendbird/uikit-utils';
import { getThumbnailUriFromFileMessage } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import ImageWithPlaceholder from '../../components/ImageWithPlaceholder';
import PressBox from '../../components/PressBox';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageContainer from './MessageContainer';
import type { GroupChannelMessageProps } from './index';

const ImageFileMessage = (props: GroupChannelMessageProps<SendbirdFileMessage>) => {
  const { onPress, onLongPress, variant = 'incoming' } = props;

  const { colors } = useUIKitTheme();

  return (
    <MessageContainer {...props}>
      <Box style={styles.container} backgroundColor={colors.ui.groupChannelMessage[variant].enabled.background}>
        <PressBox activeOpacity={0.8} onPress={onPress} onLongPress={onLongPress}>
          <ImageWithPlaceholder source={{ uri: getThumbnailUriFromFileMessage(props.message) }} style={styles.image} />
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
});

export default ImageFileMessage;
