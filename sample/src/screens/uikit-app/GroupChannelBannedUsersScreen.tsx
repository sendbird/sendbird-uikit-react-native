import React, { useState } from 'react';

import { createGroupChannelBannedUsersFragment, useSendbirdChat } from '@sendbird/uikit-react-native';
import { SendbirdGroupChannel, useAsyncEffect } from '@sendbird/uikit-utils';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import type { Routes } from '../../libs/navigation';

const GroupChannelBannedUsersFragment = createGroupChannelBannedUsersFragment();
const GroupChannelBannedUsersScreen = () => {
  const { sdk } = useSendbirdChat();
  const { navigation, params } = useAppNavigation<Routes.GroupChannelBannedUsers>();

  const [channel, setChannel] = useState<SendbirdGroupChannel>();

  useAsyncEffect(async () => {
    setChannel(await sdk.groupChannel.getChannel(params.channelUrl));
  }, []);

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
