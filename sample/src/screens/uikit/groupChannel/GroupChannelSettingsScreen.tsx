import React from 'react';

import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import { createGroupChannelSettingsFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Routes } from '../../../libs/navigation';

const GroupChannelSettingsFragment = createGroupChannelSettingsFragment();
const GroupChannelSettingsScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelSettings>();

  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <GroupChannelSettingsFragment
      channel={channel}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
      onPressMenuModeration={() => {
        // Navigate to group channel moderation
        navigation.push(Routes.GroupChannelModeration, params);
      }}
      onPressMenuMembers={() => {
        // Navigate to group channel members
        navigation.push(Routes.GroupChannelMembers, params);
      }}
      onPressMenuLeaveChannel={() => {
        // Navigate to group channel list
        navigation.navigate(Routes.GroupChannelList);
      }}
      onPressMenuNotification={() => {
        // Navigate to group channel notifications
        navigation.navigate(Routes.GroupChannelNotifications, params);
      }}
    />
  );
};

export default GroupChannelSettingsScreen;
