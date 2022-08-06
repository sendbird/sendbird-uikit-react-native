import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdAdminMessage } from '@sendbird/uikit-utils';

import type { MessageRendererInterface } from '../index';

export type AdminMessageProps = MessageRendererInterface<SendbirdAdminMessage>;
const AdminMessage = ({ message, nextMessage }: AdminMessageProps) => {
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
