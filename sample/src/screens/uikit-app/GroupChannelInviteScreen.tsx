import React, { useState } from 'react';

import { createGroupChannelInviteFragment } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native';
import type { SendbirdUser } from '@sendbird/uikit-utils';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Routes } from '../../libs/navigation';

const GroupChannelInviteFragment = createGroupChannelInviteFragment<SendbirdUser>();

const GroupChannelInviteScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelInvite>();
  const { sdk } = useSendbirdChat();

  const [channel] = useState(() => sdk.groupChannel.buildGroupChannelFromSerializedData(params.serializedChannel));

  return (
    <GroupChannelInviteFragment
      channel={channel}
      onPressHeaderLeft={() => {
        navigation.goBack();
      }}
      onInviteMembers={(channel) => {
        navigation.navigate(Routes.GroupChannel, { serializedChannel: channel.serialize() });
      }}
    />
  );
};

export default GroupChannelInviteScreen;
