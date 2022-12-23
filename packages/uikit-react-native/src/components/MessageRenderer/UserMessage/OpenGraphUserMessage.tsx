import React, { useState } from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';

import type { OGMetaData } from '@sendbird/chat/message';
import { Icon, Image, RegexText, Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { conditionChaining, urlRegexRough } from '@sendbird/uikit-utils';

import { useLocalization, useSendbirdChat, useUserProfile } from '../../../hooks/useContext';
import { openUrl } from '../../../utils/common';
import type { UserMessageProps } from './index';

type Props = UserMessageProps & {
  ogMetaData: OGMetaData;
};

const OpenGraphUserMessage = ({ message, variant, pressed, ogMetaData, children }: Props) => {
  const { mentionManager, features, currentUser } = useSendbirdChat();
  const { STRINGS } = useLocalization();
  const { show } = useUserProfile();
  const { colors, select, palette } = useUIKitTheme();

  const [imageNotFound, setImageNotFound] = useState(false);
  const color = colors.ui.message[variant][pressed ? 'pressed' : 'enabled'];

  const containerBackground = select({ dark: palette.background400, light: palette.background100 });

  return (
    <View style={[styles.bubbleContainer, { backgroundColor: containerBackground }]}>
      <View style={[styles.container, styles.bubbleContainer, { backgroundColor: color.background }]}>
        <View style={styles.messageContainer}>
          <Text body3 color={color.textMsg}>
            <RegexText
              body3
              color={color.textMsg}
              patterns={[
                {
                  regex: mentionManager.templateRegex,
                  replacer({ match, groups, parentProps, keyPrefix, index }) {
                    const user = message.mentionedUsers?.find((it) => it.userId === groups[2]);
                    if (user) {
                      return (
                        <Text
                          {...parentProps}
                          key={`${keyPrefix}-${index}`}
                          onPress={() => show(user)}
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
                  regex: urlRegexRough,
                  replacer({ match, parentProps, keyPrefix, index }) {
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
              {features.userMentionEnabled && message.mentionedMessageTemplate
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
        <TouchableOpacity
          style={{ backgroundColor: select({ dark: palette.background500, light: palette.background200 }) }}
          activeOpacity={0.85}
          onPress={() => Linking.openURL(ogMetaData.url).catch()}
        >
          <View
            style={[
              styles.ogImageContainer,
              { backgroundColor: select({ dark: palette.background500, light: palette.background200 }) },
            ]}
          >
            {conditionChaining(
              [imageNotFound],
              [
                <Icon
                  containerStyle={styles.ogImage}
                  icon={'thumbnail-none'}
                  size={48}
                  color={colors.onBackground02}
                />,
                <Image
                  source={{ uri: ogMetaData.defaultImage?.url }}
                  style={styles.ogImage}
                  resizeMode={'cover'}
                  onError={() => setImageNotFound(true)}
                />,
              ],
            )}
          </View>
          <View style={[styles.ogContainer, { backgroundColor: containerBackground }]}>
            <Text numberOfLines={3} body2 color={colors.onBackground01} style={styles.ogTitle}>
              {ogMetaData.title}
            </Text>
            {Boolean(ogMetaData.description) && (
              <Text numberOfLines={1} caption2 color={colors.onBackground01} style={styles.ogDesc}>
                {ogMetaData.description}
              </Text>
            )}
            <Text numberOfLines={1} caption2 color={colors.onBackground02}>
              {ogMetaData.url}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
};

const styles = createStyleSheet({
  bubbleContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  container: {
    width: 240,
    maxWidth: 240,
  },
  messageContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  ogContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  ogImageContainer: {
    flex: 1,
    height: 136,
  },
  ogImage: {
    width: '100%',
    height: '100%',
  },
  ogTitle: {
    marginBottom: 4,
  },
  ogDesc: {
    lineHeight: 14,
    marginBottom: 8,
  },
});

export default OpenGraphUserMessage;
