import React, { useContext } from 'react';
import { View } from 'react-native';

import { PushTriggerOption } from '@sendbird/chat';
import type { MenuBarProps } from '@sendbird/uikit-react-native-foundation';
import { Icon, MenuBar, Switch, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { useLocalization, useSendbirdChat } from '../../../hooks/useContext';
import { GroupChannelSettingsContexts } from '../module/moduleContext';
import type { GroupChannelSettingsProps } from '../types';

const GroupChannelSettingsMenu = ({
  onPressMenuModerations,
  onPressMenuMembers,
  onPressMenuLeaveChannel,
  menuItemsCreator = (menu) => menu,
}: GroupChannelSettingsProps['Menu']) => {
  const { sdk } = useSendbirdChat();
  const { channel } = useContext(GroupChannelSettingsContexts.Fragment);
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();

  const toggleNotification = async () => {
    if (channel.myPushTriggerOption === 'off') {
      await channel.setMyPushTriggerOption(PushTriggerOption.DEFAULT);
    } else {
      await channel.setMyPushTriggerOption(PushTriggerOption.OFF);
    }
  };

  const menuItems: MenuBarProps[] = menuItemsCreator([
    {
      icon: 'moderations',
      name: STRINGS.GROUP_CHANNEL_SETTINGS.MENU_MODERATIONS,
      onPress: () => onPressMenuModerations(),
      actionItem: <Icon icon={'chevron-right'} color={colors.onBackground01} />,
    },
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
        channel.leave().then(() => {
          onPressMenuLeaveChannel();
          sdk.clearCachedMessages([channel.url]).catch();
        });
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
