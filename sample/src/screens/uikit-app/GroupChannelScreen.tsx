import React, { useLayoutEffect, useState } from 'react';
import type Sendbird from 'sendbird';

import { createGroupChannelFragment } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native-core';

import { Routes, useAppNavigation } from '../../hooks/useAppNavigation';

const GroupChannelFragment = createGroupChannelFragment();

const GroupChannelScreen: React.FC = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>();
  const { sdk } = useSendbirdChat();
  const [channel] = useState<Sendbird.GroupChannel>(() =>
    sdk.GroupChannel.buildFromSerializedData(params.serializedChannel),
  );

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <GroupChannelFragment
      channel={channel}
      onPressHeaderLeft={() => {
        navigation.goBack();
      }}
      onPressHeaderRight={() => {
        // navigate to channel settings
      }}
    />
  );
};

export default GroupChannelScreen;
