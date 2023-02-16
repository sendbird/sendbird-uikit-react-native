import React from 'react';
import { View } from 'react-native';

import type { MenuBarProps } from '@sendbird/uikit-react-native-foundation';
import { Icon, MenuBar, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { useLocalization } from '../../../hooks/useContext';
import type { OpenChannelModerationProps } from '../types';

const OpenChannelModerationMenu = ({
  onPressMenuBannedUsers,
  onPressMenuMutedParticipants,
  onPressMenuOperators,
  menuItemsCreator = (menu) => menu,
}: OpenChannelModerationProps['Menu']) => {
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();

  const menuItems: MenuBarProps[] = menuItemsCreator([
    {
      icon: 'operator',
      name: STRINGS.OPEN_CHANNEL_MODERATION.MENU_OPERATORS,
      onPress: () => onPressMenuOperators(),
      actionItem: <Icon icon={'chevron-right'} color={colors.onBackground01} />,
    },
    {
      icon: 'mute',
      name: STRINGS.OPEN_CHANNEL_MODERATION.MENU_MUTED_PARTICIPANTS,
      onPress: () => onPressMenuMutedParticipants(),
      actionItem: <Icon icon={'chevron-right'} color={colors.onBackground01} />,
    },
    {
      icon: 'ban',
      name: STRINGS.OPEN_CHANNEL_MODERATION.MENU_BANNED_USERS,
      onPress: () => onPressMenuBannedUsers(),
      actionItem: <Icon icon={'chevron-right'} color={colors.onBackground01} />,
    },
  ]);

  return (
    <View>
      {menuItems.map((menu) => {
        return (
          <MenuBar
            key={menu.name}
            onPress={menu.onPress}
            name={menu.name}
            disabled={menu.disabled}
            visible={menu.visible}
            icon={menu.icon}
            iconColor={menu.iconColor}
            iconBackgroundColor={menu.iconBackgroundColor}
            actionLabel={menu.actionLabel}
            actionItem={menu.actionItem}
          />
        );
      })}
    </View>
  );
};

export default OpenChannelModerationMenu;
