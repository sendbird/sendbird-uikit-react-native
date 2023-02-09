import React from 'react';

import type { SendbirdMessage } from '@sendbird/uikit-utils';

import PressBox from '../../components/PressBox';
import Text from '../../components/Text';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageContainer from './MessageContainer';
import type { OpenChannelMessageProps } from './index';

const UnknownMessage = (props: OpenChannelMessageProps<SendbirdMessage>) => {
  const { colors } = useUIKitTheme();
  const { onPress, onLongPress, ...rest } = props;
  const color = colors.ui.openChannelMessage.default;
  return (
    <PressBox onPress={onPress} onLongPress={onLongPress}>
      {({ pressed }) => (
        <MessageContainer pressed={pressed} {...rest}>
          <Text body3 color={color.enabled.textMsg}>
            {props.strings?.unknownTitle ?? '(Unknown message type)'}
          </Text>
          <Text body3 color={color.enabled.textMsgPostfix}>
            {props.strings?.unknownDescription ?? 'Cannot read this message.'}
          </Text>
        </MessageContainer>
      )}
    </PressBox>
  );
};

export default UnknownMessage;
