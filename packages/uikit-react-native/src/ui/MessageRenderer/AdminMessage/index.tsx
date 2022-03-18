import React from 'react';
import { StyleSheet, View } from 'react-native';
import type Sendbird from 'sendbird';

import { Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import type { MessageRendererInterface } from '../index';

export type AdminMessageProps = MessageRendererInterface<Sendbird.AdminMessage>;
const AdminMessage: React.FC<AdminMessageProps> = ({ message, nextMessage }) => {
  const { colors } = useUIKitTheme();

  const isNextAdmin = nextMessage?.isAdminMessage();
  return (
    <View style={StyleSheet.flatten([styles.container, isNextAdmin ? styles.nextAdminType : styles.next])}>
      <Text caption2 color={colors.onBackground02} style={styles.text}>
        {message.message}
      </Text>
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    width: 300,
    alignSelf: 'center',
    alignItems: 'center',
  },
  nextAdminType: {
    marginBottom: 8,
  },
  next: {
    marginBottom: 16,
  },
  text: {
    textAlign: 'center',
  },
});

export default AdminMessage;
