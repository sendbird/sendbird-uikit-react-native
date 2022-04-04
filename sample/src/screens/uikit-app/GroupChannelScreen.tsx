import React, { useMemo } from 'react';

import { createGroupChannelFragment } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { Logger } from '@sendbird/uikit-utils';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Routes } from '../../libs/navigation';

const GroupChannelFragment = createGroupChannelFragment();

const GroupChannelScreen: React.FC = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>();
  const { sdk } = useSendbirdChat();
  const staleChannel = useMemo(
    () => sdk.GroupChannel.buildFromSerializedData(params.serializedChannel),
    [params.serializedChannel],
  );

  return (
    <GroupChannelFragment
      onPressImageMessage={(msg, uri) => {
        // Navigate to photo preview
        Logger.log('file uri', msg.name, uri);
      }}
      staleChannel={staleChannel}
      onChannelDeleted={() => {
        // Navigate to channel list
        navigation.navigate(Routes.GroupChannelList);
      }}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
      onPressHeaderRight={() => {
        // Navigate to group channel information
        navigation.navigate(Routes.GroupChannelInfo, { serializedChannel: params.serializedChannel });
      }}
    />
  );
};

export default GroupChannelScreen;
