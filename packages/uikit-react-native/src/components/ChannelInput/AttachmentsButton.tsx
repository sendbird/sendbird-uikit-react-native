import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Icon, createStyleSheet, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

export type AttachmentsButtonProps = {
  onPress: () => void;
  disabled: boolean;
};

const AttachmentsButton = ({ onPress, disabled }: AttachmentsButtonProps) => {
  const { colors } = useUIKitTheme();
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Icon
        color={disabled ? colors.ui.input.default.disabled.highlight : colors.ui.input.default.active.highlight}
        icon={'add'}
        size={24}
        containerStyle={styles.container}
      />
    </TouchableOpacity>
  );
};

const styles = createStyleSheet({
  container: {
    marginRight: 8,
    padding: 4,
  },
});

export default AttachmentsButton;
