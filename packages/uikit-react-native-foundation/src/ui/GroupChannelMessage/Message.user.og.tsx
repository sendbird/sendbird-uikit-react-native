import React from 'react';

import type { SendbirdUserMessage } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import PressBox from '../../components/PressBox';
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

  const { palette, select, colors } = useUIKitTheme();
  const color = colors.ui.groupChannelMessage[variant];

  return (
    <MessageContainer {...props}>
      <PressBox onPress={props.onPress} onLongPress={props.onLongPress}>
        {({ pressed }) => {
          const containerBackgroundColor = select({ dark: palette.background400, light: palette.background100 });
          return (
            <Box backgroundColor={containerBackgroundColor} style={styles.container}>
              <MessageBubble
                backgroundColor={pressed ? color.pressed.background : color.enabled.background}
                {...props}
              />
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
          );
        }}
      </PressBox>
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
