import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import type Sendbird from 'sendbird';

import { createInviteMembersFragment } from '@sendbird/uikit-react-native';
import { Logger } from '@sendbird/uikit-utils';

const InviteMembersFragment = createInviteMembersFragment<Sendbird.User>();

const InviteMembersScreen: React.FC = () => {
  const { setOptions, goBack } = useNavigation();
  const { params } = useRoute();

  Logger.log('navigationParams', params);

  useLayoutEffect(() => {
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
