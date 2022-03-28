import React, { useLayoutEffect } from 'react';
import type Sendbird from 'sendbird';

import { createInviteMembersFragment } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { Logger } from '@sendbird/uikit-utils';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Routes } from '../../libs/navigation';

const InviteMembersFragment = createInviteMembersFragment<Sendbird.User>();

const InviteMembersScreen: React.FC = () => {
  const { navigation, params } = useAppNavigation<Routes.InviteMembers>();
  const { sdk } = useSendbirdChat();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <InviteMembersFragment
      onPressInviteMembers={async (users) => {
        // Create GroupChannel with invited users
        const channelParams = new sdk.GroupChannelParams();
        if (params.channelType === 'BROADCAST') channelParams.isBroadcast = true;
        if (params.channelType === 'SUPER_GROUP') channelParams.isSuper = true;

        channelParams.isDistinct = false;
        channelParams.addUserIds(users.map((user) => user.userId));
        const channel = await sdk.GroupChannel.createChannel(channelParams);
        navigation.replace(Routes.GroupChannel, { serializedChannel: channel.serialize() });
      }}
      onPressHeaderLeft={() => {
        Logger.log('header left pressed');
        navigation.goBack();
      }}
    />
  );
};

export default InviteMembersScreen;
