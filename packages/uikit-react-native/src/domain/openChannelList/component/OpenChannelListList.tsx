import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SendbirdOpenChannel, getChannelUniqId, useFreshCallback } from '@sendbird/uikit-utils';

import type { OpenChannelListProps } from '../types';

const OpenChanelListList = ({
  openChannels,
  onLoadNext,
  flatListProps,
  renderOpenChannelPreview,
  refreshing,
  onRefresh,
}: OpenChannelListProps['List']) => {
  const renderItem: ListRenderItem<SendbirdOpenChannel> = useFreshCallback(({ item }) =>
    renderOpenChannelPreview?.({ channel: item }),
  );

  const { left, right } = useSafeAreaInsets();

  return (
    <FlatList
      refreshing={refreshing}
      data={openChannels}
      renderItem={renderItem}
      onEndReached={onLoadNext}
      onRefresh={onRefresh}
      {...flatListProps}
      contentContainerStyle={[flatListProps?.contentContainerStyle, { paddingLeft: left, paddingRight: right }]}
      keyExtractor={getChannelUniqId}
    />
  );
};

export default OpenChanelListList;
