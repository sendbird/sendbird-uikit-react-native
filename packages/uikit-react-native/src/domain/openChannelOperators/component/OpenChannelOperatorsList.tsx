import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SendbirdUser, getUserUniqId, useFreshCallback } from '@sendbird/uikit-utils';

import type { OpenChannelOperatorsProps } from '../types';

const OpenChannelOperatorsList = ({
  renderUser,
  operators,
  ListEmptyComponent,
  onLoadNext,
}: OpenChannelOperatorsProps['List']) => {
  const renderItem: ListRenderItem<SendbirdUser> = useFreshCallback(({ item }) => renderUser?.({ user: item }));
  const { left, right } = useSafeAreaInsets();

  return (
    <FlatList
      data={operators}
      renderItem={renderItem}
      contentContainerStyle={{ paddingLeft: left, paddingRight: right, flexGrow: 1 }}
      ListEmptyComponent={ListEmptyComponent}
      bounces={false}
      keyExtractor={getUserUniqId}
      onEndReached={onLoadNext}
    />
  );
};

export default OpenChannelOperatorsList;
