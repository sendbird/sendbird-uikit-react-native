import React, { useContext } from 'react';
import { View } from 'react-native';

import { PushTriggerOption } from '@sendbird/chat';
import type { MenuBarProps } from '@sendbird/uikit-react-native-foundation';
import { Icon, MenuBar, Switch, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { Logger, conditionChaining, useIIFE } from '@sendbird/uikit-utils';

import { useLocalization, useSendbirdChat } from '../../../hooks/useContext';
import { GroupChannelSettingsContexts } from '../module/moduleContext';
import type { GroupChannelSettingsProps } from '../types';

let WARN_onPressMenuNotification = false;

const GroupChannelSettingsMenu = ({
  onPressMenuModeration,
  onPressMenuMembers,
  onPressMenuLeaveChannel,
  onPressMenuNotification,
  menuItemsCreator = (menu) => menu,
}: GroupChannelSettingsProps['Menu']) => {
  const { sdk, features } = useSendbirdChat();
  const { channel } = useContext(GroupChannelSettingsContexts.Fragment);
  const { STRINGS } = useLocalization();
  const { colors } = useUIKitTheme();

  if (__DEV__ && !WARN_onPressMenuNotification && !onPressMenuNotification) {
    Logger.warn('You should pass `onPressMenuNotification` prop if using mention');
    WARN_onPressMenuNotification = true;
  }

  const toggleNotification = async () => {
    if (channel.myPushTriggerOption === 'off') {
      await channel.setMyPushTriggerOption(PushTriggerOption.DEFAULT);
    } else {
      await channel.setMyPushTriggerOption(PushTriggerOption.OFF);
    }
  };

  const { onPressNotificationMenu, actionLabelNotificationMenu, actionItemNotificationMenu } = useIIFE(() => {
    const getNotificationsLabel = () => {
      switch (channel.myPushTriggerOption) {
        case PushTriggerOption.ALL:
        case PushTriggerOption.DEFAULT:
          return STRINGS.GROUP_CHANNEL_SETTINGS.MENU_NOTIFICATION_LABEL_ON;
        case PushTriggerOption.OFF:
          return STRINGS.GROUP_CHANNEL_SETTINGS.MENU_NOTIFICATION_LABEL_OFF;
        case PushTriggerOption.MENTION_ONLY:
          return STRINGS.GROUP_CHANNEL_SETTINGS.MENU_NOTIFICATION_LABEL_MENTION_ONLY;
      }
    };

    return {
      actionLabelNotificationMenu: getNotificationsLabel(),
      actionItemNotificationMenu: conditionChaining(
        [features.userMentionEnabled],
        [
          <Icon icon={'chevron-right'} color={colors.onBackground01} />,
          <Switch value={channel.myPushTriggerOption !== 'off'} onChangeValue={toggleNotification} />,
        ],
      ),
      onPressNotificationMenu: () => {
        if (features.userMentionEnabled) onPressMenuNotification?.();
        else toggleNotification();
      },
    };
  });

  const menuItems: MenuBarProps[] = menuItemsCreator([
    {
      icon: 'moderation',
      visible: channel.myRole === 'operator',
      name: STRINGS.GROUP_CHANNEL_SETTINGS.MENU_MODERATION,
      onPress: () => onPressMenuModeration(),
      actionItem: <Icon icon={'chevron-right'} color={colors.onBackground01} />,
    },
    {
      icon: 'notifications',
      name: STRINGS.GROUP_CHANNEL_SETTINGS.MENU_NOTIFICATION,
      onPress: onPressNotificationMenu,
      actionLabel: actionLabelNotificationMenu,
      actionItem: actionItemNotificationMenu,
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

export default GroupChannelSettingsMenu;
