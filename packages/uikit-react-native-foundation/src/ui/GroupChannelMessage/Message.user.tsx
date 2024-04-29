import type { SendbirdUserMessage } from '@gathertown/uikit-utils';
import React, { useContext } from 'react';

import Box from '../../components/Box';
import PressBox from '../../components/PressBox';
import type { RegexTextPattern } from '../../components/RegexText';
import { CustomComponentContext } from '../../context/CustomComponentCtx';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageBubbleWithText from './MessageBubbleWithText';
import MessageContainer from './MessageContainer';
import type { GroupChannelMessageProps } from './index';

export type UserMessageRenderProp = (props: {
  children: React.ReactNode;
  isEdited: boolean;
  message: SendbirdUserMessage;
  pressed: boolean;
}) => React.ReactElement;

type Props = GroupChannelMessageProps<
  SendbirdUserMessage,
  {
    regexTextPatterns?: RegexTextPattern[];
    renderRegexTextChildren?: (message: SendbirdUserMessage) => string;
  }
>;

const UserMessage = (props: Props) => {
  const ctx = useContext(CustomComponentContext);
  const { variant = 'incoming', children } = props;

  const { colors } = useUIKitTheme();
  const color = colors.ui.groupChannelMessage[variant];

  return (
    <MessageContainer {...props}>
      <PressBox activeOpacity={0.8} onPress={props.onPress} onLongPress={props.onLongPress}>
        {({ pressed }) =>
          ctx?.renderUserMessage ? (
            ctx.renderUserMessage({
              pressed,
              isEdited: Boolean(props.message.updatedAt) && !!props.strings?.edited,
              message: props.message,
              children,
            })
          ) : (
            <Box
              backgroundColor={pressed ? color.pressed.background : color.enabled.background}
              style={styles.container}
            >
              <MessageBubbleWithText {...props} />
              {children}
            </Box>
          )
        }
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
