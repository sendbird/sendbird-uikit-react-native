import React, { useState } from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';

import type { OGMetaData } from '@sendbird/chat/message';
import {
  Icon,
  Image,
  Text,
  URLParsedText,
  createStyleSheet,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import { conditionChaining } from '@sendbird/uikit-utils';

import { useLocalization } from '../../../hooks/useContext';
import type { UserMessageProps } from './index';

type Props = UserMessageProps & {
  ogMetaData: OGMetaData;
};
const OpenGraphUserMessage = ({ message, variant, pressed, ogMetaData, children }: Props) => {
  const { STRINGS } = useLocalization();
  const { colors, select, palette } = useUIKitTheme();
  const color = colors.ui.message[variant][pressed ? 'pressed' : 'enabled'];
  const [imageNotFound, setImageNotFound] = useState(false);

  const containerBackground = select({ dark: palette.background400, light: palette.background100 });

  return (
    <View style={[styles.bubbleContainer, { backgroundColor: containerBackground }]}>
      <View style={[styles.container, styles.bubbleContainer, { backgroundColor: color.background }]}>
        <View style={styles.messageContainer}>
          <URLParsedText body3 color={color.textMsg}>
            {message.message}
            {Boolean(message.updatedAt) && (
              <Text body3 color={color.textEdited}>
                {STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_EDITED_POSTFIX}
              </Text>
            )}
          </URLParsedText>
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
