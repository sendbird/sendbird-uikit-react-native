import isSameDay from 'date-fns/isSameDay';
import React from 'react';
import { View } from 'react-native';

import { Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdMessage } from '@sendbird/uikit-utils';

import { useLocalization } from '../../hooks/useContext';

type Props = {
  message: SendbirdMessage;
  prevMessage?: SendbirdMessage;
};

const MessageDateSeparator = ({ message, prevMessage }: Props) => {
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();
  const sameDay = isSameDay(message.createdAt, prevMessage?.createdAt ?? 0);
  if (sameDay) return null;
  return (
    <View style={styles.container}>
      <View style={[styles.view, { backgroundColor: colors.ui.dateSeparator.default.none.background }]}>
        <Text caption1 color={colors.ui.dateSeparator.default.none.text}>
          {STRINGS.GROUP_CHANNEL.LIST_DATE_SEPARATOR(new Date(message.createdAt))}
        </Text>
      </View>
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  view: {
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
});

export default MessageDateSeparator;
