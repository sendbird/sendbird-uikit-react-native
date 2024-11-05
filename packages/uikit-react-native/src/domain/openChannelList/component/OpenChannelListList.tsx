import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { SendbirdOpenChannel, getChannelUniqId, useFreshCallback, useSafeAreaPadding } from '@sendbird/uikit-utils';

import type { OpenChannelListProps } from '../types';

const OpenChanelListList = ({
  onPressChannel,
  openChannels,
  onLoadNext,
  flatListProps,
  renderOpenChannelPreview,
  refreshing,
  onRefresh,
}: OpenChannelListProps['List']) => {
  const renderItem: ListRenderItem<SendbirdOpenChannel> = useFreshCallback(({ item }) =>
    renderOpenChannelPreview?.({ channel: item, onPress: () => onPressChannel(item) }),
  );

  const safeArea = useSafeAreaPadding(['left', 'right']);

  return (
    <FlatList
      refreshing={refreshing}
      data={openChannels}
      renderItem={renderItem}
      onEndReached={onLoadNext}
      onRefresh={onRefresh}
      {...flatListProps}
      contentContainerStyle={[flatListProps?.contentContainerStyle, safeArea]}
      keyExtractor={getChannelUniqId}
    />
  );
};

export default OpenChanelListList;
