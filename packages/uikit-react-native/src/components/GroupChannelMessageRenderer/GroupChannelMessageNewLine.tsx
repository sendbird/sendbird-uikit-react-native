import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Box, Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { useLocalization } from '../../hooks/useContext';

type Props = {
  shouldRenderNewLine?: boolean;
};

const GroupChannelMessageNewLine = ({ shouldRenderNewLine }: Props) => {
  if (!shouldRenderNewLine) return null;

  const { select, palette } = useUIKitTheme();
  const { STRINGS } = useLocalization();

  return (
    <View style={styles.container}>
      <Box backgroundColor={select({ light: palette.primary300, dark: palette.primary200 })} style={styles.line} />
      <Text caption3 color={select({ light: palette.primary300, dark: palette.primary200 })} style={styles.label}>
        {STRINGS.GROUP_CHANNEL.LIST_NEW_LINE}
      </Text>
      <Box backgroundColor={select({ light: palette.primary300, dark: palette.primary200 })} style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 12,
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
