import React from 'react';

import { useGroupChannel } from '@gathertown/uikit-chat-hooks';
import { createGroupChannelInviteFragment, useSendbirdChat } from '@gathertown/uikit-react-native';
import type { SendbirdUser } from '@gathertown/uikit-utils';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Routes } from '../../../libs/navigation';

const GroupChannelInviteFragment = createGroupChannelInviteFragment<SendbirdUser>();

const GroupChannelInviteScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelInvite>();

  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <GroupChannelInviteFragment
      channel={channel}
      onPressHeaderLeft={() => {
        navigation.goBack();
      }}
      onInviteMembers={(channel) => {
        navigation.navigate(Routes.GroupChannel, { channelUrl: channel.url });
      }}
    />
  );
};

export default GroupChannelInviteScreen;
