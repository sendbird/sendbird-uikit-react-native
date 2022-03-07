import React from 'react';
import { Pressable, View } from 'react-native';

import { Divider, Icon, Text, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

export type MenuBarProps = {
  onPress: () => void;
  disabled?: boolean;

  icon: keyof typeof Icon.Assets;
  iconBackgroundColor?: string;
  name: string;

  actionLabel?: string;
  actionItem?: React.ReactNode;
};
const MenuBar: React.FC<MenuBarProps> = ({
  disabled,
  onPress,
  icon,
  name,
  iconBackgroundColor,
  actionLabel,
  actionItem = null,
}) => {
  const { palette, colors } = useUIKitTheme();
  return (
    <View>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        style={{ paddingVertical: 16, flexDirection: 'row', alignItems: 'center' }}
      >
        {icon && (
          <Icon
            icon={icon}
            size={16}
            color={palette.background50}
            containerStyle={{
              borderRadius: 24,
              padding: 4,
              backgroundColor: iconBackgroundColor ?? palette.background400,
              marginRight: 16,
            }}
          />
        )}
        <Text subtitle2 numberOfLines={1} style={{ flex: 1, marginRight: 8 }}>
          {name}
        </Text>
        {Boolean(actionLabel) && (
          <Text subtitle1 color={colors.onBackground01} style={{ marginRight: 4 }}>
            {actionLabel}
          </Text>
        )}
        {actionItem}
      </Pressable>
      <Divider />
    </View>
  );
};

export default MenuBar;
