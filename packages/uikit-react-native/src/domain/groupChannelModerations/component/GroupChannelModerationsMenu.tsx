import React, { useContext, useState } from 'react';
import { View } from 'react-native';

import type { MenuBarProps } from '@sendbird/uikit-react-native-foundation';
import { Icon, MenuBar, Switch, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { useLocalization } from '../../../hooks/useContext';
import { GroupChannelModerationsContexts } from '../module/moduleContext';
import type { GroupChannelModerationsProps } from '../types';

const GroupChannelModerationsMenu = ({
  onPressMenuBannedUsers,
  onPressMenuMutedMembers,
  onPressMenuOperators,
  menuItemsCreator = (menu) => menu,
}: GroupChannelModerationsProps['Menu']) => {
  const { channel } = useContext(GroupChannelModerationsContexts.Fragment);
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();

  const [isFrozen, setIsFrozen] = useState(() => channel.isFrozen);

  const toggleFreeze = async () => {
    if (channel.isFrozen) {
      await channel.unfreeze();
    } else {
      await channel.freeze();
    }

    setIsFrozen(channel.isFrozen);
  };

  const menuItems: MenuBarProps[] = menuItemsCreator([
    {
      icon: 'operator',
      name: STRINGS.GROUP_CHANNEL_MODERATIONS.MENU_OPERATORS,
      onPress: () => onPressMenuOperators(),
      actionItem: <Icon icon={'chevron-right'} color={colors.onBackground01} />,
    },
    {
      icon: 'mute',
      name: STRINGS.GROUP_CHANNEL_MODERATIONS.MENU_MUTED_MEMBERS,
      onPress: () => onPressMenuMutedMembers(),
      actionItem: <Icon icon={'chevron-right'} color={colors.onBackground01} />,
    },
    {
      icon: 'ban',
      name: STRINGS.GROUP_CHANNEL_MODERATIONS.MENU_BANNED_USERS,
      onPress: () => onPressMenuBannedUsers(),
      actionItem: <Icon icon={'chevron-right'} color={colors.onBackground01} />,
    },
    {
      icon: 'freeze',
      name: STRINGS.GROUP_CHANNEL_MODERATIONS.MENU_FREEZE_CHANNEL,
      actionItem: <Switch value={isFrozen} onChangeValue={toggleFreeze} />,
      onPress: toggleFreeze,
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

export default GroupChannelModerationsMenu;
