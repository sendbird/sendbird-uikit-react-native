import React from 'react';

import { createGroupChannelCreateFragment } from '@sendbird/uikit-react-native';
import type { SendbirdUser } from '@sendbird/uikit-utils';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Routes } from '../../../libs/navigation';

const GroupChannelCreateFragment = createGroupChannelCreateFragment<SendbirdUser>();

const GroupChannelCreateScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelCreate>();

  return (
    <GroupChannelCreateFragment
      channelType={params.channelType}
      onBeforeCreateChannel={(channelParams) => {
        // Customize channel params before create
        return channelParams;
      }}
      onCreateChannel={async (channel) => {
        // Navigate to created group channel
        navigation.replace(Routes.GroupChannel, { channelUrl: channel.url });
      }}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
    />
  );
};

export default GroupChannelCreateScreen;
