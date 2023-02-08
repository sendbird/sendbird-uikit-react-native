import React from 'react';
import { FlatList, Pressable } from 'react-native';

import { useOpenChannelList } from '@sendbird/uikit-chat-hooks';
import { useSendbirdChat } from '@sendbird/uikit-react-native';
import { OpenChannelPreview } from '@sendbird/uikit-react-native-foundation';
import { getChannelUniqId } from '@sendbird/uikit-utils';

import { useAppNavigation } from '../../../../hooks/useAppNavigation';
import { Routes } from '../../../../libs/navigation';
import { OpenChannelCustomType } from '../../../../libs/openChannel';

const OpenChannelListLiveStreamsScreen = () => {
  const { sdk, currentUser } = useSendbirdChat();
  const { navigation } = useAppNavigation<Routes.OpenChannelListLiveStreams>();

  const { openChannels, next, refresh, refreshing } = useOpenChannelList(sdk, currentUser?.userId, {
    queryCreator: () =>
      sdk.openChannel.createOpenChannelListQuery({
        customTypes: [OpenChannelCustomType.LIVE],
      }),
  });

  return (
    <FlatList
      data={openChannels}
      onRefresh={refresh}
      refreshing={refreshing}
      keyExtractor={getChannelUniqId}
      onEndReached={next}
      renderItem={({ item }) => (
        <Pressable onPress={() => navigation.navigate(Routes.OpenChannel, { channelUrl: item.url })}>
          <OpenChannelPreview
            coverUrl={item.coverUrl}
            title={item.name}
            participantsCount={item.participantCount}
            frozen={item.isFrozen}
          />
        </Pressable>
      )}
    />
  );
};

export default OpenChannelListLiveStreamsScreen;
