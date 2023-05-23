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
  if (props.variant === 'incoming') {
    return <UserMessage.Incoming {...props} />;
  } else {
    return <UserMessage.Outgoing {...props} />;
  }
};

UserMessage.Incoming = function UserMessageIncoming(props: Props) {
  const { colors } = useUIKitTheme();
  const color = colors.ui.groupChannelMessage.incoming;

  return (
    <MessageContainer {...props}>
      <Box backgroundColor={color.enabled.background} style={styles.container}>
        <MessageBubble {...props} />
        {props.children}
      </Box>
    </MessageContainer>
  );
};

UserMessage.Outgoing = function UserMessageOutgoing(props: Props) {
  const { colors } = useUIKitTheme();
  const color = colors.ui.groupChannelMessage.outgoing;

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
