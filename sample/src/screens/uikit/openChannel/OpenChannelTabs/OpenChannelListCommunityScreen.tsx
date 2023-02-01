import React from 'react';
import { FlatList, Pressable } from 'react-native';

import { useOpenChannelList } from '@sendbird/uikit-chat-hooks';
import { useSendbirdChat } from '@sendbird/uikit-react-native';
import { GroupChannelPreview } from '@sendbird/uikit-react-native-foundation';

import { useAppNavigation } from '../../../../hooks/useAppNavigation';
import { Routes } from '../../../../libs/navigation';
import { OpenChannelCustomType } from '../../../../libs/openChannel';

const OpenChannelListCommunityScreen = () => {
  const { sdk, currentUser } = useSendbirdChat();
  const { navigation } = useAppNavigation<Routes.OpenChannelListCommunity>();

  const { openChannels } = useOpenChannelList(sdk, currentUser?.userId, {
    queryCreator: () =>
      sdk.openChannel.createOpenChannelListQuery({
        customTypes: [OpenChannelCustomType.COMMUNITY],
      }),
  });

  return (
    <FlatList
      data={openChannels}
      keyExtractor={(item) => item.url}
      renderItem={({ item }) => (
        <Pressable onPress={() => navigation.navigate(Routes.OpenChannel, { channelUrl: item.url })}>
          <GroupChannelPreview
            coverUrl={item.coverUrl}
            title={item.name}
            titleCaption={item.createdAt + ''}
            body={'latest message'}
            badgeCount={0}
          />
        </Pressable>
      )}
    />
  );
};

export default OpenChannelListCommunityScreen;
