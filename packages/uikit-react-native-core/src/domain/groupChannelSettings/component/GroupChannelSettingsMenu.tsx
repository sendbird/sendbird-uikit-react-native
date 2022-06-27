import React, { useContext } from 'react';
import { View } from 'react-native';

import type { MenuBarProps } from '@sendbird/uikit-react-native-foundation';
import { Icon, MenuBar, Switch, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { useLocalization } from '../../../contexts/Localization';
import { GroupChannelSettingsContext } from '../module/moduleContext';
import type { GroupChannelSettingsProps } from '../types';

const GroupChannelSettingsMenu: React.FC<GroupChannelSettingsProps['Menu']> = ({
  onPressMenuMembers,
  onLeaveChannel,
  menuItemsCreator = (menu) => menu,
}) => {
  const { channel } = useContext(GroupChannelSettingsContext.Fragment);
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();

  const toggleNotification = async () => {
    if (channel.myPushTriggerOption === 'off') {
      await channel.setMyPushTriggerOption('default');
    } else {
      await channel.setMyPushTriggerOption('off');
    }
  };

  const menuItems: MenuBarProps[] = menuItemsCreator([
    {
      icon: 'notifications',
      name: STRINGS.GROUP_CHANNEL_SETTINGS.MENU_NOTIFICATION,
      onPress: toggleNotification,
      actionItem: <Switch value={channel.myPushTriggerOption !== 'off'} onChangeValue={toggleNotification} />,
    },
    {
      icon: 'members',
      name: STRINGS.GROUP_CHANNEL_SETTINGS.MENU_MEMBERS,
      onPress: () => onPressMenuMembers(),
      actionLabel: String(channel.memberCount),
      actionItem: <Icon icon={'chevron-right'} color={colors.onBackground01} />,
    },
    {
      icon: 'leave',
      iconColor: colors.error,
      name: STRINGS.GROUP_CHANNEL_SETTINGS.MENU_LEAVE_CHANNEL,
      onPress: () => {
        onLeaveChannel();
        channel.leave();
      },
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

export default GroupChannelSettingsMenu;
