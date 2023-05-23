import React from 'react';

import type { SendbirdUserMessage } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import type { RegexTextPattern } from '../../components/RegexText';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageBubble from './MessageBubble';
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
      <Box backgroundColor={color.enabled.background} style={styles.container}>
        <MessageBubble {...props} />
        {props.children}
      </Box>
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
