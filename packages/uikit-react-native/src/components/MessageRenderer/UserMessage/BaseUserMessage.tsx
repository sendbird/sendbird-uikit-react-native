import React from 'react';
import { View } from 'react-native';

import { RegexText, Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { urlRegexStrict } from '@sendbird/uikit-utils';

import { useLocalization, useSendbirdChat, useUserProfile } from '../../../hooks/useContext';
import SBUUtils from '../../../libs/SBUUtils';
import type { UserMessageProps } from './index';

const BaseUserMessage = ({
  message,
  variant,
  pressed,
  children,
  onLongPressMentionedUser,
  onLongPressURL,
}: UserMessageProps) => {
  const { mentionManager, currentUser } = useSendbirdChat();
  const { show } = useUserProfile();
  const { STRINGS } = useLocalization();
  const { colors, palette } = useUIKitTheme();

  const color = colors.ui.message[variant][pressed ? 'pressed' : 'enabled'];

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <View style={styles.wrapper}>
        <Text body3 color={color.textMsg}>
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
                        onLongPress={onLongPressMentionedUser}
                        style={[
                          parentProps?.style,
                          { fontWeight: 'bold' },
                          user.userId === currentUser?.userId && { backgroundColor: palette.highlight },
                        ]}
                      >
                        {`${mentionManager.asMentionedMessageText(user)}`}
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
                      onPress={() => SBUUtils.openURL(match)}
                      onLongPress={onLongPressURL}
                      style={[parentProps?.style, { textDecorationLine: 'underline' }]}
                    >
                      {match}
                    </Text>
                  );
                },
              },
            ]}
          >
            {mentionManager.shouldUseMentionedMessageTemplate(message)
              ? message.mentionedMessageTemplate
              : message.message}
          </RegexText>
          {Boolean(message.updatedAt) && (
            <Text body3 color={color.textEdited}>
              {STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_EDITED_POSTFIX}
            </Text>
          )}
        </Text>
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
