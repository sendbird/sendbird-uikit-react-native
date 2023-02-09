import React from 'react';

import { useOpenChannel } from '@sendbird/uikit-chat-hooks';
import { createOpenChannelParticipantsFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import type { Routes } from '../../../libs/navigation';

const OpenChannelParticipantsFragment = createOpenChannelParticipantsFragment();

const OpenChannelParticipantsScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.OpenChannelParticipants>();

  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <OpenChannelParticipantsFragment
      channel={channel}
      onPressHeaderLeft={() => {
        navigation.goBack();
      }}
    />
  );
};

export default OpenChannelParticipantsScreen;
