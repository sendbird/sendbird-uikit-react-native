import React from 'react';

import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import { createMessageSearchFragment, useSendbirdChat } from '@sendbird/uikit-react-native';

import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Routes } from '../../libs/navigation';

const MessageSearchFragment = createMessageSearchFragment();
const MessageSearchScreen = () => {
  const { sdk } = useSendbirdChat();
  const { navigation, params } = useAppNavigation<Routes.MessageSearch>();

  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <MessageSearchFragment
      channel={channel}
      onPressHeaderLeft={() => navigation.goBack()}
      onPressSearchResultItem={({ message, channel }) => {
        navigation.push(Routes.GroupChannel, {
          channelUrl: channel.url,
          searchItem: { startingPoint: message.createdAt },
        });
      }}
    />
  );
};

export default MessageSearchScreen;
