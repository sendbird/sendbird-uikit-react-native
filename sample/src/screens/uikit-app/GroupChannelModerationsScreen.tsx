import React, { useState } from 'react';

import { createGroupChannelModerationsFragment, useSendbirdChat } from '@sendbird/uikit-react-native';
import { SendbirdGroupChannel, useAsyncEffect } from '@sendbird/uikit-utils';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Routes } from '../../libs/navigation';

const GroupChannelModerationsFragment = createGroupChannelModerationsFragment();
const GroupChannelModerationsScreen = () => {
  const { sdk } = useSendbirdChat();
  const { navigation, params } = useAppNavigation<Routes.GroupChannelModerations>();

  const [channel, setChannel] = useState<SendbirdGroupChannel>();

  useAsyncEffect(async () => {
    setChannel(await sdk.groupChannel.getChannel(params.channelUrl));
  }, []);

  if (!channel) return null;

  return (
    <GroupChannelModerationsFragment
      channel={channel}
      onPressMenuOperators={() => {
        // Navigate to group channel operators
        navigation.push(Routes.GroupChannelOperators, params);
      }}
      onPressMenuMutedMembers={() => {
        // Navigate to group channel muted members
        navigation.push(Routes.GroupChannelMutedMembers, params);
      }}
      onPressMenuBannedUsers={() => {
        // Navigate to group channel banned users
        navigation.push(Routes.GroupChannelBannedUsers, params);
      }}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
    />
  );
};

export default GroupChannelModerationsScreen;
