import React from 'react';

import { useOpenChannel } from '@sendbird/uikit-chat-hooks';
import { createOpenChannelRegisterOperatorFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Routes } from '../../../libs/navigation';

const OpenChannelRegisterOperatorFragment = createOpenChannelRegisterOperatorFragment();
const OpenChannelRegisterOperatorScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.OpenChannelRegisterOperator>();

  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <OpenChannelRegisterOperatorFragment
      channel={channel}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
      onPressHeaderRight={() => {
        // Navigate to open channel operators
        navigation.navigate(Routes.OpenChannelOperators, params);
      }}
    />
  );
};

export default OpenChannelRegisterOperatorScreen;
