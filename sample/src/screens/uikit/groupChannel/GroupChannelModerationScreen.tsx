import React from 'react';

import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import { createGroupChannelModerationFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Routes } from '../../../libs/navigation';

const GroupChannelModerationFragment = createGroupChannelModerationFragment();
const GroupChannelModerationScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelModeration>();

  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <GroupChannelModerationFragment
      channel={channel}
      onPressMenuOperators={() => {
        // Navigate to group channel operators
        navigation.push(Routes.GroupChannelOperators, params);
      }}
      onPressMenuMutedMembers={() => {
        // Navigate to group channel muted members
        navigation.push(Routes.GroupChannelMutedMembers, params);
      }}
      onPressMenuBannedUsers={() => {
        // Navigate to group channel banned users
        navigation.push(Routes.GroupChannelBannedUsers, params);
      }}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
    />
  );
};

export default GroupChannelModerationScreen;
