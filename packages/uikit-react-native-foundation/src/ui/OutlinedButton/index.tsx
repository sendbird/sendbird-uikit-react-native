import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';

import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';

type OutlinedButtonProps = {
  children: string;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const OutlinedButton = ({ children, onPress, containerStyle }: OutlinedButtonProps) => {
  const { colors } = useUIKitTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.outlinedButton, { borderColor: colors.onBackground01 }, containerStyle]}
    >
      <Text button color={colors.onBackground01} numberOfLines={1} style={styles.outlinedButtonText}>
        {children}
      </Text>
    </Pressable>
  );
};

const styles = createStyleSheet({
  outlinedButton: {
    borderRadius: 4,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlinedButtonText: {
    textAlign: 'center',
    width: '100%',
  },
});

export default OutlinedButton;
