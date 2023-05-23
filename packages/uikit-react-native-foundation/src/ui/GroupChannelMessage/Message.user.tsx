import React from 'react';

import type { SendbirdUserMessage } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import PressBox from '../../components/PressBox';
import type { RegexTextPattern } from '../../components/RegexText';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageBubbleWithText from './MessageBubbleWithText';
import MessageContainer from './MessageContainer';
import type { GroupChannelMessageProps } from './index';

type Props = GroupChannelMessageProps<
  SendbirdUserMessage,
  {
    regexTextPatterns?: RegexTextPattern[];
    renderRegexTextChildren?: (message: SendbirdUserMessage) => string;
  }
>;

const UserMessage = (props: Props) => {
  const { variant = 'incoming' } = props;

  const { colors } = useUIKitTheme();
  const color = colors.ui.groupChannelMessage[variant];

  return (
    <MessageContainer {...props}>
      <PressBox onPress={props.onPress} onLongPress={props.onLongPress}>
        {({ pressed }) => (
          <Box backgroundColor={pressed ? color.pressed.background : color.enabled.background} style={styles.container}>
            <MessageBubbleWithText {...props} />
            {props.children}
          </Box>
        )}
      </PressBox>
    </MessageContainer>
  );
};

const styles = createStyleSheet({
  container: {
    overflow: 'hidden',
    borderRadius: 16,
  },
});

export default UserMessage;
