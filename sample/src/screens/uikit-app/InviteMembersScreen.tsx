import React, { useLayoutEffect } from 'react';
import type Sendbird from 'sendbird';

import { createInviteMembersFragment } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { Logger } from '@sendbird/uikit-utils';

import { Routes, useAppNavigation } from '../../hooks/useAppNavigation';

const InviteMembersFragment = createInviteMembersFragment<Sendbird.User>();

const InviteMembersScreen: React.FC = () => {
  const { navigation, params } = useAppNavigation<Routes.InviteMembers>();
  const { sdk } = useSendbirdChat();

  useLayoutEffect(() => {
    Logger.log('channel type', params.channelType);
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <InviteMembersFragment
      onPressInviteMembers={async (users) => {
        // Create GroupChannel with invited users
        const params = new sdk.GroupChannelParams();
        params.addUserIds(users.map((user) => user.userId));
        params.isDistinct = false;
        await sdk.GroupChannel.createChannel(params);

        navigation.goBack();
      }}
      onPressHeaderLeft={() => {
        Logger.log('header left pressed');
        navigation.goBack();
      }}
    />
  );
};

export default InviteMembersScreen;
