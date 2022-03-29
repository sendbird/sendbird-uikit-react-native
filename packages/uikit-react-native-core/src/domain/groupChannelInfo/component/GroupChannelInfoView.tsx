import React, { useContext } from 'react';
import { ScrollView, View } from 'react-native';

import {
  Avatar,
  Divider,
  Icon,
  MenuBar,
  Switch,
  Text,
  createStyleSheet,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation';
import type { MenuBarProps } from '@sendbird/uikit-react-native-foundation';
import { Logger, getGroupChannelTitle, getMembersExcludeMe, useDefaultChannelCover } from '@sendbird/uikit-utils';

import { useLocalization } from '../../../contexts/Localization';
import { useSendbirdChat } from '../../../contexts/SendbirdChat';
import { GroupChannelInfoContext } from '../module/moduleContext';
import type { GroupChannelInfoProps } from '../types';

const GroupChannelInfoView: React.FC<GroupChannelInfoProps['View']> = ({ onPressMenuMembers, onLeaveChannel }) => {
  const { channel } = useContext(GroupChannelInfoContext.Fragment);
  const { currentUser } = useSendbirdChat();
  const { LABEL } = useLocalization();
  const { colors } = useUIKitTheme();

  const toggleNotification = async () => {
    if (channel.myPushTriggerOption === 'off') {
      await channel.setMyPushTriggerOption('default');
    } else {
      await channel.setMyPushTriggerOption('off');
    }
  };

  const menuItems: MenuBarProps[] = [
    {
      icon: 'notifications',
      name: LABEL.GROUP_CHANNEL_INFO.MENU_NOTIFICATION,
      onPress: toggleNotification,
      actionItem: <Switch value={channel.myPushTriggerOption !== 'off'} onChangeValue={toggleNotification} />,
    },
    {
      icon: 'members',
      name: LABEL.GROUP_CHANNEL_INFO.MENU_MEMBERS,
      onPress: () => onPressMenuMembers(),
      actionLabel: String(channel.memberCount),
      actionItem: <Icon icon={'chevron-right'} color={colors.onBackground01} />,
    },
    {
      icon: 'leave',
      iconColor: colors.error,
      name: LABEL.GROUP_CHANNEL_INFO.MENU_LEAVE_CHANNEL,
      onPress: () => {
        onLeaveChannel();
        channel.leave();
      },
    },
  ];

  if (!currentUser) {
    Logger.warn('Cannot render GroupChannelInfoFragment, User is not connected');
    return null;
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.viewContainer}>
      <View style={styles.userInfoContainer}>
        {useDefaultChannelCover(channel) ? (
          <Avatar uri={channel.coverUrl} size={80} containerStyle={styles.avatarContainer} />
        ) : (
          <Avatar.Group size={80} containerStyle={styles.avatarContainer}>
            {getMembersExcludeMe(channel, currentUser?.userId).map((m) => (
              <Avatar key={m.userId} uri={m.profileUrl} />
            ))}
          </Avatar.Group>
        )}
        <Text h1 numberOfLines={1}>
          {getGroupChannelTitle(currentUser.userId, channel, LABEL.STRINGS.USER_NO_NAME)}
        </Text>
      </View>
      <Divider />

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
    </ScrollView>
  );
};

const styles = createStyleSheet({
  container: { flex: 1 },
  viewContainer: { paddingHorizontal: 16 },
  userInfoContainer: { paddingVertical: 24, alignItems: 'center' },
  avatarContainer: { marginBottom: 12 },
  userIdContainer: { paddingVertical: 16 },
  userIdLabel: { marginBottom: 4 },
});
export default GroupChannelInfoView;
