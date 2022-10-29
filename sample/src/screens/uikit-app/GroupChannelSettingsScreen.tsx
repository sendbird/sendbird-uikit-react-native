import React, { useState } from 'react';

import { createGroupChannelSettingsFragment } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native';
import { SendbirdGroupChannel, useAsyncEffect } from '@sendbird/uikit-utils';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Routes } from '../../libs/navigation';

const GroupChannelSettingsFragment = createGroupChannelSettingsFragment();
const GroupChannelSettingsScreen = () => {
  const { sdk } = useSendbirdChat();
  const { navigation, params } = useAppNavigation<Routes.GroupChannelSettings>();
  const [channel, setChannel] = useState<SendbirdGroupChannel>();

  useAsyncEffect(async () => {
    setChannel(await sdk.groupChannel.getChannel(params.channelUrl));
  }, []);

  if (!channel) return null;

  return (
    <GroupChannelSettingsFragment
      channel={channel}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
      onPressMenuModerations={() => {
        // Navigate to group channel moderations
        navigation.push(Routes.GroupChannelModerations, params);
      }}
      onPressMenuMembers={() => {
        // Navigate to group channel members
        navigation.push(Routes.GroupChannelMembers, params);
      }}
      onPressMenuLeaveChannel={() => {
        // Navigate to group channel list
        navigation.navigate(Routes.GroupChannelList);
      }}
    />
  );
};

export default GroupChannelSettingsScreen;
