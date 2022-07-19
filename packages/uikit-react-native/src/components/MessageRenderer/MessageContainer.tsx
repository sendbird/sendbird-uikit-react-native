import React from 'react';
import { View } from 'react-native';

import { createStyleSheet } from '@sendbird/uikit-react-native-foundation';

const MessageContainer: React.FC = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = createStyleSheet({
  container: {
    flexDirection: 'column',
    paddingHorizontal: 16,
  },
});

export default MessageContainer;
