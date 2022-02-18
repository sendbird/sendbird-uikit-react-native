import { useNavigation } from '@react-navigation/native';
import React, { useContext, useLayoutEffect } from 'react';
import { TouchableOpacity } from 'react-native';

import { createGroupChannelListFragment } from '@sendbird/uikit-react-native';
import { GroupChannelListContext, useConnection } from '@sendbird/uikit-react-native-core';
import { Header, Icon } from '@sendbird/uikit-react-native-foundation';
import { Logger } from '@sendbird/uikit-utils';

const GroupChannelListFragment = createGroupChannelListFragment();

/**
 * Example for customizing navigation header with DomainContext
 * Component should return null for hide uikit header
 * */
const UseNavigationHeader = () => {
  const { setOptions, goBack } = useNavigation();
  const { disconnect } = useConnection();
  const { fragment, typeSelector } = useContext(GroupChannelListContext);

  const onBack = () => {
    goBack();
    disconnect();
  };
  useLayoutEffect(() => {
    setOptions({
      headerShown: true,
      headerTitle: fragment.headerTitle,
      headerLeft: () => (
        <TouchableOpacity onPress={onBack}>
          <Icon icon={'arrow-left'} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={typeSelector.show}>
          <Icon icon={'create'} />
        </TouchableOpacity>
      ),
    });
  }, []);
  return null;
};
const CustomGroupChannelListScreen = () => {
  return (
    <GroupChannelListFragment
      FragmentHeader={UseNavigationHeader}
      skipTypeSelection={false}
      onPressCreateChannel={(channelType) => {
        Logger.log('channel create', channelType);
      }}
      onPressChannel={(channel) => {
        Logger.log('channel pressed', channel.url);
      }}
    />
  );
};

// @ts-ignore
const DefaultGroupChannelListScreen = () => {
  const { goBack, setOptions } = useNavigation();
  const { disconnect } = useConnection();

  useLayoutEffect(() => {
    setOptions({ headerShown: false });
  }, []);

  const onBack = () => {
    goBack();
    disconnect();
  };

  return (
    <GroupChannelListFragment
      FragmentHeader={(props) => <Header {...props} onPressLeft={onBack} left={<Icon icon={'arrow-left'} />} />}
      skipTypeSelection={false}
      onPressCreateChannel={(channelType) => {
        Logger.log('channel create', channelType);
      }}
      onPressChannel={(channel) => {
        Logger.log('channel pressed', channel.url);
      }}
    />
  );
};

export default CustomGroupChannelListScreen;
