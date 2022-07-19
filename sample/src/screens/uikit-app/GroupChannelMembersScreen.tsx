import React, { useState } from 'react';

import { createGroupChannelMembersFragment } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Routes } from '../../libs/navigation';

const GroupChannelMembersFragment = createGroupChannelMembersFragment();

const GroupChannelMembersScreen: React.FC = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelInvite>();
  const { sdk } = useSendbirdChat();

  const [channel] = useState(() => sdk.GroupChannel.buildFromSerializedData(params.serializedChannel));

  return (
    <GroupChannelMembersFragment
      channel={channel}
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
