import React from 'react';

import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import { createGroupChannelOperatorsFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Routes } from '../../../libs/navigation';

const GroupChannelOperatorsFragment = createGroupChannelOperatorsFragment();
const GroupChannelOperatorsScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelOperators>();

  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
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
        navigation.navigate(Routes.GroupChannelRegisterOperator, params);
      }}
    />
  );
};

export default GroupChannelOperatorsScreen;
