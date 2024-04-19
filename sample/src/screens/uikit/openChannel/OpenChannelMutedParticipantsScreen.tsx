import React from 'react';

import { useOpenChannel } from '@gathertown/uikit-chat-hooks';
import { createOpenChannelMutedParticipantsFragment, useSendbirdChat } from '@gathertown/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import type { Routes } from '../../../libs/navigation';

const OpenChannelMutedMembersFragment = createOpenChannelMutedParticipantsFragment();
const OpenChannelMutedParticipantsScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.OpenChannelMutedParticipants>();

  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <OpenChannelMutedMembersFragment
      channel={channel}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
    />
  );
};

export default OpenChannelMutedParticipantsScreen;
