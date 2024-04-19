import React from 'react';

import { useGroupChannel } from '@gathertown/uikit-chat-hooks';
import { useSendbirdChat } from '@gathertown/uikit-react-native';
import { createGroupChannelNotificationsFragment } from '@gathertown/uikit-react-native';

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
