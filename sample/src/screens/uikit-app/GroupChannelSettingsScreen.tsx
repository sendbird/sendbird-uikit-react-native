import React, { useState } from 'react';

import { createGroupChannelSettingsFragment } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Routes } from '../../libs/navigation';

const GroupChannelSettingsFragment = createGroupChannelSettingsFragment();
const GroupChannelSettingsScreen: React.FC = () => {
  const { sdk } = useSendbirdChat();
  const { navigation, params } = useAppNavigation<Routes.GroupChannelSettings>();
  const [channel] = useState(() => sdk.GroupChannel.buildFromSerializedData(params.serializedChannel));

  return (
    <GroupChannelSettingsFragment
      staleChannel={channel}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
      onPressMenuMembers={() => {
        // Navigate to group channel members
        navigation.navigate(Routes.GroupChannelMembers, params);
      }}
      onPressMenuLeaveChannel={() => {
        // Navigate to group channel list
        navigation.navigate(Routes.GroupChannelList);
      }}
    />
  );
};

export default GroupChannelSettingsScreen;
