import React from 'react';

import { useOpenChannel } from '@sendbird/uikit-chat-hooks';
import { useSendbirdChat } from '@sendbird/uikit-react-native';
import { createOpenChannelOperatorsFragment } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Routes } from '../../../libs/navigation';

const OpenChannelOperatorsFragment = createOpenChannelOperatorsFragment();
const OpenChannelOperatorsScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.OpenChannelOperators>();

  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <OpenChannelOperatorsFragment
      channel={channel}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
      onPressHeaderRight={() => {
        // Navigate to open channel set as operators
        navigation.navigate(Routes.OpenChannelRegisterOperator, params);
      }}
    />
  );
};

export default OpenChannelOperatorsScreen;
