import React, { useLayoutEffect, useState } from 'react';

import { createGroupChannelInfoFragment } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native-core';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Routes } from '../../libs/navigation';

const GroupChannelInfoFragment = createGroupChannelInfoFragment();
const GroupChannelInfoScreen: React.FC = () => {
  const { sdk } = useSendbirdChat();
  const { navigation, params } = useAppNavigation<Routes.GroupChannelInfo>();
  const [channel] = useState(() => sdk.GroupChannel.buildFromSerializedData(params.serializedChannel));

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <GroupChannelInfoFragment
      staleChannel={channel}
      onPressHeaderLeft={() => {
        // navigate to group channel
        navigation.goBack();
      }}
      onPressMenuMembers={() => {
        // navigate to group channel members
        navigation.navigate(Routes.GroupChannelInvite, params);
      }}
      onLeaveChannel={() => {
        // navigate to group channel list
        navigation.navigate(Routes.GroupChannelList);
      }}
    />
  );
};

export default GroupChannelInfoScreen;
