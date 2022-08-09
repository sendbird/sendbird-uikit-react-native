import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';

import { Icon, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

type Props = {
  visible: boolean;
  onPress: () => void;
};
const ScrollToBottomButton = ({ visible, onPress }: Props) => {
  const { palette, select } = useUIKitTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!visible}
      style={[
        styles.container,
        {
          opacity: visible ? 1 : 0,
          backgroundColor: select({ dark: palette.background400, light: palette.background50 }),
        },
      ]}
    >
      <Icon icon={'chevron-down'} size={22} />
    </TouchableOpacity>
  );
};

const styles = createStyleSheet({
  container: {
    padding: 8,
    borderRadius: 24,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: 'black',
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
      },
    }),
  },
});

export default React.memo(ScrollToBottomButton);
