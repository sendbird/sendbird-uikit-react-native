import React from 'react';
import { Pressable, View } from 'react-native';

import { conditionChaining } from '@sendbird/uikit-utils';

import Divider from '../../components/Divider';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';

export type MenuBarProps = {
  variant?: 'default' | 'contained';

  onPress: () => void;
  disabled?: boolean;
  visible?: boolean;

  icon: keyof typeof Icon.Assets;
  iconColor?: string;
  iconBackgroundColor?: string;
  name: string;

  actionLabel?: string;
  actionItem?: React.ReactNode;
};
const MenuBar = ({
  variant = 'default',
  disabled,
  visible = true,
  onPress,
  name,
  icon,
  iconColor,
  iconBackgroundColor,
  actionLabel,
  actionItem = null,
}: MenuBarProps) => {
  const { palette, colors } = useUIKitTheme();

  if (!visible) return null;

  return (
    <View>
      <Pressable disabled={disabled} onPress={onPress} style={styles.container}>
        {icon && (
          <Icon
            icon={icon}
            size={variant === 'contained' ? 16 : 24}
            color={conditionChaining(
              [variant === 'contained', iconColor],
              [palette.background50, iconColor, colors.primary],
            )}
            containerStyle={[
              styles.icon,
              variant === 'contained' && styles.containedIcon,
              variant === 'contained' && { backgroundColor: iconBackgroundColor ?? palette.background400 },
            ]}
          />
        )}
        <Text subtitle2 numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        {Boolean(actionLabel) && (
          <Text subtitle2 numberOfLines={1} color={colors.onBackground02} style={styles.actionLabel}>
            {actionLabel}
          </Text>
        )}
        {actionItem}
      </Pressable>
      <Divider />
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    marginRight: 8,
  },
  icon: {
    marginRight: 16,
  },
  containedIcon: {
    borderRadius: 24,
    padding: 4,
  },
  actionLabel: {
    marginRight: 4,
  },
});

export default MenuBar;
