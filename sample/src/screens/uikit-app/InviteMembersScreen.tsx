import React, { useLayoutEffect } from 'react';
import type Sendbird from 'sendbird';

import { createInviteMembersFragment } from '@sendbird/uikit-react-native';
import { Logger } from '@sendbird/uikit-utils';

import { Routes, useAppNavigation } from '../../hooks/useAppNavigation';

const InviteMembersFragment = createInviteMembersFragment<Sendbird.User>();

const InviteMembersScreen: React.FC = () => {
  const { navigation, params } = useAppNavigation<Routes.InviteMembers>();
  const { setOptions, goBack } = navigation;

  useLayoutEffect(() => {
    console.log('route params', params);
    setOptions({ headerShown: false });
  }, []);

  return (
    <InviteMembersFragment
      onPressInviteMembers={async (users) => {
        Logger.log('invite pressed:', users.length);
      }}
      onPressHeaderLeft={() => {
        Logger.log('header left pressed');
        goBack();
      }}
    />
  );
};

export default InviteMembersScreen;
