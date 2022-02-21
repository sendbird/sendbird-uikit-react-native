import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import type Sendbird from 'sendbird';

import { createInviteMembersFragment } from '@sendbird/uikit-react-native';
import { useConnection } from '@sendbird/uikit-react-native-core';
import { Header, Icon } from '@sendbird/uikit-react-native-foundation';
import { Logger } from '@sendbird/uikit-utils';

const InviteMembersFragment = createInviteMembersFragment<Sendbird.User>();

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
      onPressInviteMembers={async () => {
        Logger.log('channel pressed');
      }}
      Header={(props) => <Header {...props} onPressLeft={onBack} left={<Icon icon={'arrow-left'}>{'Logout'}</Icon>} />}
      onPressHeaderLeft={() => {
        Logger.log('channel pressed');
      }}
    />
  );
};

export default InviteMembersScreen;
