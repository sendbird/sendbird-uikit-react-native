import React from 'react';

import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import { createGroupChannelMutedMembersFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import type { Routes } from '../../../libs/navigation';

const GroupChannelMutedMembersFragment = createGroupChannelMutedMembersFragment();
const GroupChannelMutedMembersScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelMutedMembers>();

  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
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
