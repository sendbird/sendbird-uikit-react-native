import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';

import { Header, Icon } from '@sendbird/uikit-react-native';
import { createInviteMembersFragment, useConnection } from '@sendbird/uikit-react-native-core';
import { Logger } from '@sendbird/uikit-utils';

const InviteMembersFragment = createInviteMembersFragment();

const InviteMembersScreen: React.FC = () => {
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
    <InviteMembersFragment
      Header={(props) => <Header {...props} onPressLeft={onBack} left={<Icon icon={'arrow-left'}>{'Logout'}</Icon>} />}
      onPressHeaderLeft={() => {
        Logger.log('channel pressed');
      }}
    />
  );
};

export default InviteMembersScreen;
