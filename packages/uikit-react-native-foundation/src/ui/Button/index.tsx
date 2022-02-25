import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';

import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Icon from '../Icon';
import Text from '../Text';

type Props = {
  style?: StyleProp<ViewStyle>;
  icon?: keyof typeof Icon.Assets;
  variant?: 'contained' | 'text';
  disabled?: boolean;
  onPress?: () => void;
};
const Button: React.FC<Props> = ({ icon, variant = 'contained', disabled, onPress, style, children }) => {
  const { colors } = useUIKitTheme();

  const getStateColor = (pressed: boolean, disabled?: boolean) => {
    const stateColors = colors.ui.button[variant];
    if (disabled) return stateColors.disabled;
    if (pressed) return stateColors.pressed;
    return stateColors.enabled;
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => {
        const stateColor = getStateColor(pressed, disabled);
        return [{ backgroundColor: stateColor.background }, styles.container, style];
      }}
    >
      {({ pressed }) => {
        const stateColor = getStateColor(pressed, disabled);

        return (
          <>
            {icon && <Icon size={24} icon={icon} color={stateColor.content} containerStyle={styles.icon} />}
            <Text button color={stateColor.content} style={styles.text}>
              {children}
            </Text>
          </>
        );
      }}
    </Pressable>
  );
};

const styles = createStyleSheet({
  container: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { marginVertical: -4, marginRight: 8 },
  text: {},
});

export default Button;
