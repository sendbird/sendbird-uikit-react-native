import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { SendbirdBaseMessage, getMessageUniqId, useFreshCallback } from '@sendbird/uikit-utils';

import type { MessageSearchProps } from '../types';

const MessageSearchList = ({
  messages,
  renderSearchResultItem,
  flatListProps,
  onPressSearchResultItem,
  channel,
}: MessageSearchProps['List']) => {
  const renderItem: ListRenderItem<SendbirdBaseMessage> = useFreshCallback(({ item }) => {
    return renderSearchResultItem({
      message: item,
      onPress: () => onPressSearchResultItem({ message: item, channel }),
      channel,
    });
  });

  return <FlatList {...flatListProps} data={messages} renderItem={renderItem} keyExtractor={getMessageUniqId} />;
};

export default MessageSearchList;
