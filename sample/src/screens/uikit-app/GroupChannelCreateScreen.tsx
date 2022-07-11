import React from 'react';
import type Sendbird from 'sendbird';

import { createGroupChannelCreateFragment } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Routes } from '../../libs/navigation';

const GroupChannelCreateFragment = createGroupChannelCreateFragment<Sendbird.User>();

const GroupChannelCreateScreen: React.FC = () => {
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
        navigation.replace(Routes.GroupChannel, { serializedChannel: channel.serialize() });
      }}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
    />
  );
};

export default GroupChannelCreateScreen;
