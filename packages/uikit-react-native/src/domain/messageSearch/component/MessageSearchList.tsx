import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { SendbirdBaseMessage, useFreshCallback } from '@sendbird/uikit-utils';

import type { MessageSearchProps } from '../types';

const MessageSearchList = ({ messages, renderMessage, flatListProps }: MessageSearchProps['List']) => {
  const renderItem: ListRenderItem<SendbirdBaseMessage> = useFreshCallback(({ item }) =>
    renderMessage({ message: item }),
  );

  return <FlatList data={messages} renderItem={renderItem} {...flatListProps} />;
};

export default MessageSearchList;
