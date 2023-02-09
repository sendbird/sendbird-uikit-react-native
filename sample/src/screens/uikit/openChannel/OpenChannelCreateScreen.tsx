import React from 'react';

import { createOpenChannelCreateFragment } from '@sendbird/uikit-react-native';
import type { SendbirdOpenChannel } from '@sendbird/uikit-utils';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Routes } from '../../../libs/navigation';
import { OpenChannelCustomType } from '../../../libs/openChannel';

const OpenChannelCreateFragment = createOpenChannelCreateFragment();
const OpenChannelCreateScreen = () => {
  const { navigation } = useAppNavigation<Routes.OpenChannelCreate>();

  const navigateToOpenChannel = (channel: SendbirdOpenChannel) => {
    navigation.replace(Routes.OpenChannel, { channelUrl: channel.url });
  };
  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <OpenChannelCreateFragment
      onCreateChannel={navigateToOpenChannel}
      onPressHeaderLeft={navigateBack}
      onBeforeCreateChannel={(params) => {
        params.customType = OpenChannelCustomType.COMMUNITY;
        return params;
      }}
    />
  );
};

export default OpenChannelCreateScreen;
