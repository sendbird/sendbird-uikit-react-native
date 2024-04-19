import React from 'react';

import { useGroupChannel } from '@gathertown/uikit-chat-hooks';
import { createGroupChannelBannedUsersFragment, useSendbirdChat } from '@gathertown/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import type { Routes } from '../../../libs/navigation';

const GroupChannelBannedUsersFragment = createGroupChannelBannedUsersFragment();
const GroupChannelBannedUsersScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelBannedUsers>();

  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <GroupChannelBannedUsersFragment
      channel={channel}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
    />
  );
};

export default GroupChannelBannedUsersScreen;
