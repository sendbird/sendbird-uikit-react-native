import React from 'react';

import { useOpenChannel } from '@sendbird/uikit-chat-hooks';
import { createOpenChannelModerationFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Routes } from '../../../libs/navigation';

const OpenChannelModerationFragment = createOpenChannelModerationFragment();
const OpenChannelModerationScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.OpenChannelModeration>();

  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <OpenChannelModerationFragment
      channel={channel}
      onPressMenuOperators={() => {
        // Navigate to open channel operators
        navigation.push(Routes.OpenChannelOperators, params);
      }}
      onPressMenuMutedParticipants={() => {
        // Navigate to open channel muted participants
        navigation.push(Routes.OpenChannelMutedParticipants, params);
      }}
      onPressMenuBannedUsers={() => {
        // Navigate to open channel banned users
        navigation.push(Routes.OpenChannelBannedUsers, params);
      }}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
    />
  );
};

export default OpenChannelModerationScreen;
