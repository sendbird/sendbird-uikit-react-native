import React, { useState } from 'react';

import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import { createGroupChannelThreadFragment, useSendbirdChat } from '@sendbird/uikit-react-native';
import type { SendbirdFileMessage, SendbirdUserMessage } from '@sendbird/uikit-utils';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Routes } from '../../../libs/navigation';

const GroupChannelThreadFragment = createGroupChannelThreadFragment();

const GroupChannelThreadScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelThread>();

  const { sdk, groupChannelFragmentOptions } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  const [parentMessage] = useState(
    () =>
      sdk.message.buildMessageFromSerializedData(params.serializedMessage) as SendbirdUserMessage | SendbirdFileMessage,
  );
  if (!channel || !parentMessage) return null;

  return (
    <GroupChannelThreadFragment
      channel={channel}
      parentMessage={parentMessage}
      startingPoint={params.startingPoint}
      onPressMediaMessage={(fileMessage, deleteMessage) => {
        // Navigate to media viewer
        navigation.navigate(Routes.FileViewer, {
          serializedFileMessage: fileMessage.serialize(),
          deleteMessage,
        });
      }}
      onParentMessageDeleted={() => {
        navigation.goBack();
      }}
      onChannelDeleted={() => {
        // Should leave channel, navigate to channel list
        navigation.navigate(Routes.GroupChannelList);
      }}
      onPressHeaderLeft={() => {
        // Navigate back
        navigation.goBack();
      }}
      onPressHeaderSubtitle={() => {
        // Navigate to parent message
        groupChannelFragmentOptions.overrideSearchItemStartingPoint = parentMessage.createdAt;
        navigation.navigate(Routes.GroupChannel, {
          channelUrl: channel.url,
        });
      }}
    />
  );
};

export default GroupChannelThreadScreen;
