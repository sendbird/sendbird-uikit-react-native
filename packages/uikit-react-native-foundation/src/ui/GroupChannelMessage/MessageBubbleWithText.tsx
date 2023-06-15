import React from 'react';

import { SendbirdUserMessage, urlRegexStrict } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import RegexText, { RegexTextPattern } from '../../components/RegexText';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import type { GroupChannelMessageProps } from './index';

type Props = GroupChannelMessageProps<
  SendbirdUserMessage,
  {
    backgroundColor?: string;
    regexTextPatterns?: RegexTextPattern[];
    renderRegexTextChildren?: (message: SendbirdUserMessage) => string;
  }
>;

const MessageBubbleWithText = ({
  backgroundColor,
  message,
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
    <Box backgroundColor={backgroundColor} style={styles.bubble}>
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
                    onPress={() => onPressURL?.(match)}
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
  );
};

const styles = createStyleSheet({
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  urlText: {
    textDecorationLine: 'underline',
  },
});
export default MessageBubbleWithText;
