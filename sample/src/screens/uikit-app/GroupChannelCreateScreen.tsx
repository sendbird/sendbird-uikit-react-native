import React from 'react';
import type Sendbird from 'sendbird';

import { createGroupChannelCreateFragment } from '@sendbird/uikit-react-native';
import { Logger } from '@sendbird/uikit-utils';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Routes } from '../../libs/navigation';

const GroupChannelCreateFragment = createGroupChannelCreateFragment<Sendbird.User>();

const GroupChannelCreateScreen: React.FC = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelCreate>();

  return (
    <GroupChannelCreateFragment
      onBeforeCreateChannel={(channelParams) => {
        // Create GroupChannel with invited users
        if (params.channelType === 'BROADCAST') channelParams.isBroadcast = true;
        if (params.channelType === 'SUPER_GROUP') channelParams.isSuper = true;
        return channelParams;
      }}
      onCreateChannel={async (channel) => {
        navigation.replace(Routes.GroupChannel, { serializedChannel: channel.serialize() });
      }}
      onPressHeaderLeft={() => {
        Logger.log('header left pressed');
        navigation.goBack();
      }}
    />
  );
};

export default GroupChannelCreateScreen;
