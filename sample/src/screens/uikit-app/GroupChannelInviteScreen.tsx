import React, { useLayoutEffect, useState } from 'react';
import type Sendbird from 'sendbird';

import { createGroupChannelInviteFragment } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native-core';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Routes } from '../../libs/navigation';

const GroupChannelInviteFragment = createGroupChannelInviteFragment<Sendbird.User>();

const GroupChannelInviteScreen: React.FC = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelInvite>();
  const { sdk } = useSendbirdChat();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const [channel] = useState(() => sdk.GroupChannel.buildFromSerializedData(params.serializedChannel));

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
