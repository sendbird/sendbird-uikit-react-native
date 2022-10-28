import React, { useState } from 'react';

import { createGroupChannelMutedMembersFragment, useSendbirdChat } from '@sendbird/uikit-react-native';
import { SendbirdGroupChannel, useAsyncEffect } from '@sendbird/uikit-utils';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import type { Routes } from '../../libs/navigation';

const GroupChannelMutedMembersFragment = createGroupChannelMutedMembersFragment();
const GroupChannelMutedMembersScreen = () => {
  const { sdk } = useSendbirdChat();
  const { navigation, params } = useAppNavigation<Routes.GroupChannelModerations>();

  const [channel, setChannel] = useState<SendbirdGroupChannel>();

  useAsyncEffect(async () => {
    setChannel(await sdk.groupChannel.getChannel(params.channelUrl));
  }, []);

  if (!channel) return null;

  return (
    <GroupChannelMutedMembersFragment
      channel={channel}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
    />
  );
};

export default GroupChannelMutedMembersScreen;
