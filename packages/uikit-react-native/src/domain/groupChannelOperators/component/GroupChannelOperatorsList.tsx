import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { SendbirdMember } from '@sendbird/uikit-utils';
import { useFreshCallback } from '@sendbird/uikit-utils';

import type { GroupChannelOperatorsProps } from '../types';

const GroupChannelOperatorsList = ({
  operators,
  renderUser,
  ListEmptyComponent,
}: GroupChannelOperatorsProps['List']) => {
  const renderItem: ListRenderItem<SendbirdMember> = useFreshCallback(({ item }) => renderUser?.({ user: item }));
  const { left, right } = useSafeAreaInsets();

  return (
    <FlatList
      data={operators}
      renderItem={renderItem}
      contentContainerStyle={{ paddingLeft: left, paddingRight: right, flexGrow: 1 }}
      ListEmptyComponent={ListEmptyComponent}
      bounces={false}
    />
  );
};

export default GroupChannelOperatorsList;
