import React from 'react';
import { Image, View } from 'react-native';
import type Sendbird from 'sendbird';

import { Text, URLParsedText, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import type { UserMessageProps } from './index';

type Props = UserMessageProps & {
  ogMetaData: Sendbird.OGMetaData;
};

const OpenGraphUserMessage: React.FC<Props> = ({ message, variant, pressed, ogMetaData }) => {
  const { colors, select, palette } = useUIKitTheme();
  const color = colors.ui.message[variant][pressed ? 'pressed' : 'enabled'];
  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <View style={styles.messageContainer}>
        <URLParsedText body3 color={color.textMsg}>
          {message.message}
        </URLParsedText>
      </View>
      <Image source={{ uri: ogMetaData.defaultImage.url }} style={styles.ogImage} resizeMode={'cover'} />
      <View
        style={[
          styles.ogContainer,
          { backgroundColor: select({ dark: palette.background400, light: palette.background100 }) },
        ]}
      >
        <Text numberOfLines={3} body2 color={colors.onBackground01} style={styles.ogTitle}>
          {ogMetaData.title}
        </Text>
        <Text numberOfLines={1} caption2 color={colors.onBackground01} style={styles.ogDesc}>
          {ogMetaData.description}
        </Text>
        <Text numberOfLines={1} caption2 color={colors.onBackground02}>
          {ogMetaData.url}
        </Text>
      </View>
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
  ogImage: {
    width: 240,
    height: 136,
  },
  ogTitle: {
    marginBottom: 4,
  },
  ogDesc: {
    marginBottom: 8,
  },
});

export default OpenGraphUserMessage;
