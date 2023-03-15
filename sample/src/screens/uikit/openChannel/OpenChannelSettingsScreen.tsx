import React from 'react';

import { useOpenChannel } from '@sendbird/uikit-chat-hooks';
import { createOpenChannelSettingsFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Routes } from '../../../libs/navigation';
import { OpenChannelCustomType } from '../../../libs/openChannel';

const OpenChannelSettingsFragment = createOpenChannelSettingsFragment();
const OpenChannelSettingsScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.OpenChannelSettings>();

  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <OpenChannelSettingsFragment
      channel={channel}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
      onPressMenuModeration={() => {
        // Navigate to open channel moderation
        navigation.push(Routes.OpenChannelModeration, params);
      }}
      onPressMenuParticipants={() => {
        // Navigate to open channel participants
        navigation.push(Routes.OpenChannelParticipants, params);
      }}
      onPressMenuDeleteChannel={() => {
        // Navigate to open channel list
        if (channel.customType.includes(OpenChannelCustomType.LIVE)) {
          navigation.navigate(Routes.OpenChannelListLiveStreams);
        } else if (channel.customType.includes(OpenChannelCustomType.COMMUNITY)) {
          navigation.navigate(Routes.OpenChannelListCommunity);
        } else {
          navigation.navigate(Routes.OpenChannelTabs);
        }
      }}
      onNavigateToOpenChannel={() => {
        // Navigate to open channel. This function is called when current user is unregistered from the operator.
        navigation.navigate(Routes.OpenChannel, params);
      }}
    />
  );
};

export default OpenChannelSettingsScreen;
