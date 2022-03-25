import React from 'react';
import { View } from 'react-native';

import { createStyleSheet } from '@sendbird/uikit-react-native-foundation';

const ProviderLayout: React.FC = ({ children }) => {
  return <View style={styles.view}>{children}</View>;
};

const styles = createStyleSheet({
  view: {
    flex: 1,
  },
});

export default ProviderLayout;
