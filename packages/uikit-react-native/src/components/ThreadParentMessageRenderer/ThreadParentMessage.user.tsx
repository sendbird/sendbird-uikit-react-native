import React from 'react';

import { type RegexTextPattern, Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { RegexText, createStyleSheet } from '@sendbird/uikit-react-native-foundation';
import { SendbirdUserMessage, urlRegexStrict } from '@sendbird/uikit-utils';

import { ThreadParentMessageRendererProps } from './index';

type Props = ThreadParentMessageRendererProps<{
  regexTextPatterns?: RegexTextPattern[];
  renderRegexTextChildren?: (message: SendbirdUserMessage) => string;
}>;

const ThreadParentMessageUser = (props: Props) => {
  const userMessage: SendbirdUserMessage = props.parentMessage as SendbirdUserMessage;
  if (!userMessage) return null;

  const { colors } = useUIKitTheme();

  return (
    <Text body3 color={colors.onBackground01} suppressHighlighting>
      <RegexText
        body3
        color={colors.onBackground01}
        patterns={[
          ...(props.regexTextPatterns ?? []),
          {
            regex: urlRegexStrict,
            replacer({ match, parentProps, keyPrefix, index }) {
              return (
                <Text
                  {...parentProps}
                  key={`${keyPrefix}-${index}`}
                  onPress={() => props.onPressURL?.(match)}
                  style={[parentProps?.style, styles.urlText]}
                >
                  {match}
                </Text>
              );
            },
          },
        ]}
      >
        {props.renderRegexTextChildren?.(userMessage)}
      </RegexText>
      {Boolean(userMessage.updatedAt) && (
        <Text body3 color={colors.onBackground02}>
          {' (edited)'}
        </Text>
      )}
    </Text>
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

export default ThreadParentMessageUser;
