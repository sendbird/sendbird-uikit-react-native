import React from 'react';
import { View } from 'react-native';

import { RegexText, Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { urlRegexStrict } from '@sendbird/uikit-utils';

import { useSendbirdChat, useUserProfile } from '../../../hooks/useContext';
import { openUrl } from '../../../utils/common';
import type { UserMessageProps } from './index';

const BaseUserMessage = ({ message, variant, pressed, children }: UserMessageProps) => {
  const { colors } = useUIKitTheme();
  const color = colors.ui.message[variant][pressed ? 'pressed' : 'enabled'];
  const { mentionManager, features } = useSendbirdChat();
  const { show } = useUserProfile();
  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <View style={styles.wrapper}>
        <RegexText
          body3
          color={color.textMsg}
          patterns={[
            {
              regex: mentionManager.templateRegex,
              replacer({ match, groups, parentProps, index, keyPrefix }) {
                const user = message.mentionedUsers?.find((it) => it.userId === groups[2]);
                if (user) {
                  return (
                    <Text
                      {...parentProps}
                      key={`${keyPrefix}-${index}`}
                      onPress={() => show(user)}
                      style={[parentProps?.style, { fontWeight: 'bold' }]}
                    >
                      {`${mentionManager.config.trigger}${user.nickname}`}
                    </Text>
                  );
                }
                return match;
              },
            },
            {
              regex: urlRegexStrict,
              replacer({ match, parentProps, index, keyPrefix }) {
                return (
                  <Text
                    {...parentProps}
                    key={`${keyPrefix}-${index}`}
                    onPress={() => openUrl(match)}
                    style={[parentProps?.style, { textDecorationLine: 'underline' }]}
                  >
                    {match}
                  </Text>
                );
              },
            },
          ]}
        >
          {features.mentionEnabled && message.mentionedMessageTemplate
            ? message.mentionedMessageTemplate
            : message.message}
        </RegexText>
      </View>
      {children}
    </View>
  );
};
const styles = createStyleSheet({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  wrapper: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});

export default BaseUserMessage;
