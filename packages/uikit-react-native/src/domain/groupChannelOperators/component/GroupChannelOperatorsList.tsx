import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { SendbirdUser, getUserUniqId, useFreshCallback, useSafeAreaPadding } from '@sendbird/uikit-utils';

import type { GroupChannelOperatorsProps } from '../types';

const GroupChannelOperatorsList = ({
  operators,
  renderUser,
  ListEmptyComponent,
  onLoadNext,
}: GroupChannelOperatorsProps['List']) => {
  const renderItem: ListRenderItem<SendbirdUser> = useFreshCallback(({ item }) => renderUser?.({ user: item }));
  const safeArea = useSafeAreaPadding(['left', 'right']);

  return (
    <FlatList
      data={operators}
      renderItem={renderItem}
      contentContainerStyle={{ ...safeArea, flexGrow: 1 }}
      ListEmptyComponent={ListEmptyComponent}
      bounces={false}
      keyExtractor={getUserUniqId}
      onEndReached={onLoadNext}
    />
  );
};

export default GroupChannelOperatorsList;
