import React, { useContext } from 'react';

import type { SendbirdFileMessage } from '@gathertown/uikit-utils';
import { getThumbnailUriFromFileMessage } from '@gathertown/uikit-utils';

import Box from '../../components/Box';
import ImageWithPlaceholder from '../../components/ImageWithPlaceholder';
import PressBox from '../../components/PressBox';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageContainer from './MessageContainer';
import type { GroupChannelMessageProps } from './index';
import { CustomComponentContext } from '../../context/CustomComponentCtx';

const ImageFileMessage = (props: GroupChannelMessageProps<SendbirdFileMessage>) => {
  const { onPress, onLongPress, variant = 'incoming' } = props;
  const ctx = useContext(CustomComponentContext);

  const { colors } = useUIKitTheme();

  const content = (
    <ImageWithPlaceholder source={{ uri: getThumbnailUriFromFileMessage(props.message) }} style={styles.image} />
  );

  return (
    <MessageContainer {...props}>
      <PressBox activeOpacity={0.8} onPress={onPress} onLongPress={onLongPress}>
        {
          ctx?.renderGenericMessage ? ctx.renderGenericMessage({ content }) : (
            <Box style={styles.container} backgroundColor={colors.ui.groupChannelMessage[variant].enabled.background}>
              {content}
            </Box>
          )
        }
      </PressBox>
      {props.children}
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
