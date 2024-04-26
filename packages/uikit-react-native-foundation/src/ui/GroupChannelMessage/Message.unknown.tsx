import React, { useContext } from 'react';

import type { SendbirdMessage } from '@gathertown/uikit-utils';

import Box from '../../components/Box';
import PressBox from '../../components/PressBox';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageContainer from './MessageContainer';
import type { GroupChannelMessageProps } from './index';
import { CustomComponentContext } from '../../context/CustomComponentCtx';

export type UnknownMessageRenderProp = (props: { title: string; description: string; }) => React.ReactElement;

const UnknownMessage = (props: GroupChannelMessageProps<SendbirdMessage>) => {
  const { variant = 'incoming' } = props;
  const ctx = useContext(CustomComponentContext);

  const { colors } = useUIKitTheme();
  const color = colors.ui.groupChannelMessage['incoming'];
  const titleColor = variant === 'incoming' ? colors.onBackground01 : colors.onBackgroundReverse01;
  const descColor = variant === 'incoming' ? colors.onBackground02 : colors.onBackgroundReverse02;
  const title = props.strings?.unknownTitle ?? '(Unknown message type)';
  const description = props.strings?.unknownDescription ?? 'Cannot read this message.';

  return (
    <MessageContainer {...props}>
      <PressBox onPress={props.onPress} onLongPress={props.onLongPress}>
        {({ pressed }) => ctx?.renderUnknownMessage ? ctx.renderUnknownMessage({ title, description }) : (
          <Box style={styles.bubble} backgroundColor={pressed ? color.pressed.background : color.enabled.background}>
            <Text body3 color={titleColor}>
              {title}
            </Text>
            <Text body3 color={descColor}>
              {description}
            </Text>
          </Box>
        )}
      </PressBox>
    </MessageContainer>
  );
};

const styles = createStyleSheet({
  bubble: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
});

export default UnknownMessage;
