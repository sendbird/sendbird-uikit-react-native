import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Box, Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { useLocalization } from '../../hooks/useContext';

type Props = {
  shouldRenderNewLine?: boolean;
};

const GroupChannelMessageNewLine = ({ shouldRenderNewLine }: Props) => {
  if (!shouldRenderNewLine) return null;

  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();

  return (
    <View style={styles.container}>
      <Box backgroundColor={colors.primary} style={styles.line} />
      <Text caption3 numberOfLines={1} color={colors.primary} style={styles.label}>
        {STRINGS.GROUP_CHANNEL.LIST_NEW_LINE}
      </Text>
      <Box backgroundColor={colors.primary} style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  line: {
    flex: 1,
    height: 1,
  },
  label: {
    marginHorizontal: 4,
  },
});

export default React.memo(GroupChannelMessageNewLine);
