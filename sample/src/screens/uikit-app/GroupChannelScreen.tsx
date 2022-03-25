import React, { useLayoutEffect, useMemo } from 'react';

import { createGroupChannelFragment } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { Logger } from '@sendbird/uikit-utils';

import { Routes, useAppNavigation } from '../../hooks/useAppNavigation';

const GroupChannelFragment = createGroupChannelFragment();

const GroupChannelScreen: React.FC = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>();
  const { sdk } = useSendbirdChat();
  const staleChannel = useMemo(() => sdk.GroupChannel.buildFromSerializedData(params.serializedChannel), []);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <GroupChannelFragment
      onPressImageMessage={(msg, uri) => {
        // navigate to photo preview
        Logger.log('file uri', msg.name, uri);
      }}
      staleChannel={staleChannel}
      onChannelDeleted={() => {
        // navigate to channel list
        navigation.navigate(Routes.GroupChannelList);
      }}
      onPressHeaderLeft={() => {
        // navigate to channel list
        navigation.goBack();
      }}
      onPressHeaderRight={() => {
        // navigate to channel settings
      }}
    />
  );
};

export default GroupChannelScreen;
