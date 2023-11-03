import React from 'react';

import type { SendbirdMessage } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import PressBox from '../../components/PressBox';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageContainer from './MessageContainer';
import type { GroupChannelMessageProps } from './index';

const UnknownMessage = (props: GroupChannelMessageProps<SendbirdMessage>) => {
  const { variant = 'incoming' } = props;

  const { colors } = useUIKitTheme();
  const color = colors.ui.groupChannelMessage[variant];
  const titleColor = variant === 'incoming' ? colors.onBackground01 : colors.onBackgroundReverse01;
  const descColor = variant === 'incoming' ? colors.onBackground02 : colors.onBackgroundReverse02;

  return (
    <MessageContainer {...props}>
      <PressBox onPress={props.onPress} onLongPress={props.onLongPress}>
        {({ pressed }) => (
          <Box style={styles.bubble} backgroundColor={pressed ? color.pressed.background : color.enabled.background}>
            <Text body3 color={titleColor}>
              {props.strings?.unknownTitle ?? '(Unknown message type)'}
            </Text>
            <Text body3 color={descColor}>
              {props.strings?.unknownDescription ?? 'Cannot read this message.'}
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
