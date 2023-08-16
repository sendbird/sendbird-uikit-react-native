import React from 'react';

import type { SendbirdFileMessage } from '@sendbird/uikit-utils';
import { getThumbnailUriFromFileMessage } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import ImageWithPlaceholder from '../../components/ImageWithPlaceholder';
import PressBox from '../../components/PressBox';
import createStyleSheet from '../../styles/createStyleSheet';
import MessageContainer from './MessageContainer';
import type { OpenChannelMessageProps } from './index';

const ImageFileMessage = (props: OpenChannelMessageProps<SendbirdFileMessage>) => {
  const { onPress, onLongPress, ...rest } = props;
  const uri = getThumbnailUriFromFileMessage(props.message);
  return (
    <MessageContainer {...rest}>
      <Box borderRadius={8} overflow={'hidden'} style={styles.container}>
        <PressBox style={styles.container} activeOpacity={0.8} onPress={onPress} onLongPress={onLongPress}>
          <ImageWithPlaceholder source={{ uri }} width={'100%'} height={'100%'} />
        </PressBox>
      </Box>
    </MessageContainer>
  );
};

const styles = createStyleSheet({
  container: {
    maxWidth: 296,
    height: 196,
  },
});

export default ImageFileMessage;
