import React, { useState } from 'react';
import { Image, Linking, TouchableOpacity, View } from 'react-native';
import type Sendbird from 'sendbird';

import { useLocalization } from '@sendbird/uikit-react-native-core';
import { Icon, Text, URLParsedText, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { conditionChaining } from '@sendbird/uikit-utils';

import type { UserMessageProps } from './index';

type Props = UserMessageProps & { ogMetaData: Sendbird.OGMetaData };
const OpenGraphUserMessage: React.FC<Props> = ({ message, variant, pressed, ogMetaData }) => {
  const { LABEL } = useLocalization();
  const { colors, select, palette } = useUIKitTheme();
  const color = colors.ui.message[variant][pressed ? 'pressed' : 'enabled'];
  const [imageNotFound, setImageNotFound] = useState(false);
  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <View style={styles.messageContainer}>
        <URLParsedText body3 color={color.textMsg}>
          {message.message}
          {Boolean(message.updatedAt) && (
            <Text body3 color={color.textEdited}>
              {LABEL.GROUP_CHANNEL.LIST_MESSAGE_EDITED_POSTFIX}
            </Text>
          )}
        </URLParsedText>
      </View>
      <TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL(ogMetaData.url)}>
        <View
          style={[
            styles.ogImageContainer,
            { backgroundColor: select({ dark: palette.background500, light: palette.background200 }) },
          ]}
        >
          {conditionChaining(
            [imageNotFound],
            [
              <Icon containerStyle={styles.ogImage} icon={'thumbnail-none'} size={48} color={colors.onBackground02} />,
              <Image
                source={{ uri: ogMetaData.defaultImage.url }}
                style={styles.ogImage}
                resizeMode={'cover'}
                onError={() => setImageNotFound(true)}
              />,
            ],
          )}
        </View>
        <View
          style={[
            styles.ogContainer,
            { backgroundColor: select({ dark: palette.background400, light: palette.background100 }) },
          ]}
        >
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
  );
};

const styles = createStyleSheet({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
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
    width: 240,
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
    marginBottom: 8,
  },
});

export default OpenGraphUserMessage;
