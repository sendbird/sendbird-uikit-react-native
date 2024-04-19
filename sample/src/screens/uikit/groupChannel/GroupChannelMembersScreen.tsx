import React from 'react';

import { useGroupChannel } from '@gathertown/uikit-chat-hooks';
import { createGroupChannelMembersFragment, useSendbirdChat } from '@gathertown/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Routes } from '../../../libs/navigation';

const GroupChannelMembersFragment = createGroupChannelMembersFragment();

const GroupChannelMembersScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelInvite>();

  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <GroupChannelMembersFragment
      channel={channel}
      onPressHeaderLeft={() => {
        navigation.goBack();
      }}
      onPressHeaderRight={() => {
        navigation.push(Routes.GroupChannelInvite, params);
      }}
    />
  );
};

export default GroupChannelMembersScreen;
