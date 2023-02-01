import React from 'react';

import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import { useSendbirdChat } from '@sendbird/uikit-react-native';
import { createGroupChannelNotificationsFragment } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import type { Routes } from '../../../libs/navigation';

const GroupChannelNotificationsFragment = createGroupChannelNotificationsFragment();
const GroupChannelNotificationsScreen = () => {
  const { params, navigation } = useAppNavigation<Routes.GroupChannelNotifications>();
  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);

  if (!channel) return null;

  return (
    <GroupChannelNotificationsFragment
      channel={channel}
      onPressHeaderLeft={() => {
        navigation.goBack();
      }}
    />
  );
};

export default GroupChannelNotificationsScreen;
