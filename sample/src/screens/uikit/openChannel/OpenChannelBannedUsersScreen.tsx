import React from 'react';

import { useOpenChannel } from '@sendbird/uikit-chat-hooks';
import { createOpenChannelBannedUsersFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import type { Routes } from '../../../libs/navigation';

const OpenChannelBannedUsersFragment = createOpenChannelBannedUsersFragment();
const OpenChannelBannedUsersScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.OpenChannelBannedUsers>();

  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <OpenChannelBannedUsersFragment
      channel={channel}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
    />
  );
};

export default OpenChannelBannedUsersScreen;
