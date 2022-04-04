import React, { useState } from 'react';

import { createGroupChannelInfoFragment } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native-core';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Routes } from '../../libs/navigation';

const GroupChannelInfoFragment = createGroupChannelInfoFragment();
const GroupChannelInfoScreen: React.FC = () => {
  const { sdk } = useSendbirdChat();
  const { navigation, params } = useAppNavigation<Routes.GroupChannelInfo>();
  const [channel] = useState(() => sdk.GroupChannel.buildFromSerializedData(params.serializedChannel));

  return (
    <GroupChannelInfoFragment
      staleChannel={channel}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
      onPressMenuMembers={() => {
        // Navigate to group channel members
        navigation.navigate(Routes.GroupChannelMembers, params);
      }}
      onLeaveChannel={() => {
        // Navigate to group channel list
        navigation.navigate(Routes.GroupChannelList);
      }}
    />
  );
};

export default GroupChannelInfoScreen;
