import React, { useState } from 'react';

import { createGroupChannelOperatorsFragment, useSendbirdChat } from '@sendbird/uikit-react-native';
import { SendbirdGroupChannel, useAsyncEffect } from '@sendbird/uikit-utils';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import type { Routes } from '../../libs/navigation';

const GroupChannelOperatorsFragment = createGroupChannelOperatorsFragment();
const GroupChannelOperatorsScreen = () => {
  const { sdk } = useSendbirdChat();
  const { navigation, params } = useAppNavigation<Routes.GroupChannelOperators>();

  const [channel, setChannel] = useState<SendbirdGroupChannel>();

  useAsyncEffect(async () => {
    setChannel(await sdk.groupChannel.getChannel(params.channelUrl));
  }, []);

  if (!channel) return null;

  return (
    <GroupChannelOperatorsFragment
      channel={channel}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
      onPressHeaderRight={() => {
        // Navigate to group channel set as operators
        channel?.createMemberListQuery({ limit: 20 });
      }}
    />
  );
};

export default GroupChannelOperatorsScreen;
