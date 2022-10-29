import React from 'react';

import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import { createGroupChannelOperatorsAddFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Routes } from '../../libs/navigation';

const GroupChannelOperatorsAddFragment = createGroupChannelOperatorsAddFragment();
const GroupChannelOperatorsAddScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelOperatorsAdd>();

  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <GroupChannelOperatorsAddFragment
      channel={channel}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
      onPressHeaderRight={() => {
        // Navigate to group channel set as operators
        navigation.navigate(Routes.GroupChannelOperators, params);
      }}
    />
  );
};

export default GroupChannelOperatorsAddScreen;
