import React from 'react';

import { useOpenChannel } from '@sendbird/uikit-chat-hooks';
import { createOpenChannelFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Routes } from '../../../libs/navigation';
import { OpenChannelCustomType } from '../../../libs/openChannel';

const OpenChannelFragment = createOpenChannelFragment();

const OpenChannelScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.OpenChannel>();

  const { sdk } = useSendbirdChat();
  const { channel } = useOpenChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <OpenChannelFragment
      channel={channel}
      onPressMediaMessage={(fileMessage, deleteMessage) => {
        // Navigate to media viewer
        navigation.navigate(Routes.FileViewer, {
          serializedFileMessage: fileMessage.serialize(),
          deleteMessage,
        });
      }}
      onChannelDeleted={() => {
        // Should leave channel, navigate to channel list
        if (channel.customType.includes(OpenChannelCustomType.LIVE)) {
          navigation.navigate(Routes.OpenChannelListLiveStreams);
        } else if (channel.customType.includes(OpenChannelCustomType.COMMUNITY)) {
          navigation.navigate(Routes.OpenChannelListCommunity);
        } else {
          navigation.navigate(Routes.OpenChannelTabs);
        }
      }}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
      onPressHeaderRightWithSettings={() => {
        // Navigate to open channel settings
        navigation.push(Routes.OpenChannelSettings, params);
      }}
      onPressHeaderRightWithParticipants={() => {
        // Navigate to open channel participants
        navigation.push(Routes.OpenChannelParticipants, params);
      }}
    />
  );
};

export default OpenChannelScreen;
