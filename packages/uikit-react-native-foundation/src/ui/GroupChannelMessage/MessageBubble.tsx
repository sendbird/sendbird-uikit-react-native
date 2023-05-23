import React from 'react';

import { SendbirdUserMessage, urlRegexStrict } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import PressBox from '../../components/PressBox';
import RegexText, { RegexTextPattern } from '../../components/RegexText';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import type { GroupChannelMessageProps } from './index';

type Props = GroupChannelMessageProps<
  SendbirdUserMessage,
  {
    regexTextPatterns?: RegexTextPattern[];
    renderRegexTextChildren?: (message: SendbirdUserMessage) => string;
  }
>;

const MessageBubble = ({
  message,
  onPress,
  onPressURL,
  onLongPress,
  strings,
  variant = 'incoming',
  regexTextPatterns = [],
  renderRegexTextChildren = (msg) => msg.message,
}: Props) => {
  const { colors } = useUIKitTheme();
  const color = colors.ui.groupChannelMessage[variant];
  return (
    <PressBox onPress={onPress} onLongPress={onLongPress}>
      {({ pressed }) => (
        <Box
          style={[
            styles.bubble,
            {
              backgroundColor: pressed ? color.pressed.background : color.enabled.background,
            },
          ]}
        >
          <Text body3 color={color.enabled.textMsg} suppressHighlighting>
            <RegexText
              body3
              color={color.enabled.textMsg}
              patterns={[
                ...regexTextPatterns,
                {
                  regex: urlRegexStrict,
                  replacer({ match, parentProps, keyPrefix, index }) {
                    return (
                      <Text
                        {...parentProps}
                        key={`${keyPrefix}-${index}`}
                        onPress={onPressURL}
                        onLongPress={onLongPress}
                        style={[parentProps?.style, styles.urlText]}
                      >
                        {match}
                      </Text>
                    );
                  },
                },
              ]}
            >
              {renderRegexTextChildren(message)}
            </RegexText>
            {Boolean(message.updatedAt) && (
              <Text body3 color={color.enabled.textEdited}>
                {strings?.edited ?? ' (edited)'}
              </Text>
            )}
          </Text>
        </Box>
      )}
    </PressBox>
  );
};

const styles = createStyleSheet({
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  containerRadius: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  urlText: {
    textDecorationLine: 'underline',
  },
});
export default MessageBubble;
