import React from 'react';
import { View } from 'react-native';

import { createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

const ProviderLayout = ({ children }: React.PropsWithChildren) => {
  const { colors } = useUIKitTheme();
  return <View style={[styles.view, { backgroundColor: colors.background }]}>{children}</View>;
};

const styles = createStyleSheet({
  view: {
    flex: 1,
  },
});

export default ProviderLayout;
