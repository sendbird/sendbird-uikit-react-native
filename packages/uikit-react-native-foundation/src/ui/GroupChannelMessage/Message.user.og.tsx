import React from 'react';

import type { SendbirdUserMessage } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import type { RegexTextPattern } from '../../components/RegexText';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageBubble from './MessageBubble';
import MessageContainer from './MessageContainer';
import MessageOpenGraph from './MessageOpenGraph';
import type { GroupChannelMessageProps } from './index';

type Props = GroupChannelMessageProps<
  SendbirdUserMessage,
  {
    regexTextPatterns?: RegexTextPattern[];
    renderRegexTextChildren?: (message: SendbirdUserMessage) => string;
  }
>;

const OpenGraphUserMessage = (props: Props) => {
  const { variant = 'incoming' } = props;

  const { palette, select } = useUIKitTheme();
  const containerBackground = select({ dark: palette.background400, light: palette.background100 });

  return (
    <MessageContainer {...props}>
      <Box backgroundColor={containerBackground} style={styles.container}>
        <MessageBubble {...props} />
        {props.message.ogMetaData && (
          <MessageOpenGraph
            variant={variant}
            ogMetaData={props.message.ogMetaData}
            onLongPress={props.onLongPress}
            onPressURL={props.onPressURL}
          />
        )}
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
});

export default OpenGraphUserMessage;
