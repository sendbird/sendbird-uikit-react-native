import React, { useState } from 'react';

import { createGroupChannelMembersFragment } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native-core';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Routes } from '../../libs/navigation';

const GroupChannelMembersFragment = createGroupChannelMembersFragment();

const GroupChannelMembersScreen: React.FC = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelInvite>();
  const { sdk } = useSendbirdChat();

  const [staleChannel] = useState(() => sdk.GroupChannel.buildFromSerializedData(params.serializedChannel));

  return (
    <GroupChannelMembersFragment
      staleChannel={staleChannel}
      onPressHeaderLeft={() => {
        navigation.goBack();
      }}
      onPressHeaderRight={() => {
        navigation.navigate(Routes.GroupChannelInvite, params);
      }}
    />
  );
};

export default GroupChannelMembersScreen;
