import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { Pressable } from 'react-native';

import { SBIcon, createGroupChannelListFragment } from '@sendbird/uikit-react-native';
import { useConnection } from '@sendbird/uikit-react-native-core';
import SBHeader from '@sendbird/uikit-react-native/src/ui/SBHeader';
import { Logger } from '@sendbird/uikit-utils';

const GroupChannelListFragment = createGroupChannelListFragment();

const GroupChannelListScreen = () => {
  const { setOptions, goBack } = useNavigation();
  const { disconnect } = useConnection();

  useLayoutEffect(() => {
    setOptions({ headerShown: false });
  }, []);
  return (
    <GroupChannelListFragment
      Header={({ title, right }) =>
        SBHeader({
          title,
          left: (
            <Pressable
              onPress={() => {
                goBack();
                disconnect();
              }}
            >
              <SBIcon icon={'arrow-left'}>{'Logout'}</SBIcon>
            </Pressable>
          ),
          right,
        })
      }
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
