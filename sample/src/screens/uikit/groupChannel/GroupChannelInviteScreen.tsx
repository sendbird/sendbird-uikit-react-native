import React from 'react';

import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import { createGroupChannelInviteFragment, useSendbirdChat } from '@sendbird/uikit-react-native';
import type { SendbirdUser } from '@sendbird/uikit-utils';

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
