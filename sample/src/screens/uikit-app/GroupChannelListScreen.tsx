import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';

import { Header, Icon, createGroupChannelListFragment } from '@sendbird/uikit-react-native';
import { useConnection } from '@sendbird/uikit-react-native-core';
import { Logger } from '@sendbird/uikit-utils';

const GroupChannelListFragment = createGroupChannelListFragment();

const GroupChannelListScreen = () => {
  const { setOptions, goBack } = useNavigation();
  const { disconnect } = useConnection();

  const onBack = () => {
    goBack();
    disconnect();
  };

  useLayoutEffect(() => {
    setOptions({ headerShown: false });
  }, []);

  return (
    <GroupChannelListFragment
      Header={(props) => <Header {...props} onPressLeft={onBack} left={<Icon icon={'arrow-left'}>{'Logout'}</Icon>} />}
      onPressCreateChannel={() => {
        Logger.log('channel create');
      }}
      onPressChannel={(channel) => {
        Logger.log('channel pressed', channel.url);
      }}
    />
  );
};

export default GroupChannelListScreen;
