import React from 'react';
import { FlatList } from 'react-native';

import type { InviteMembersProps } from '../types';

const InviteMembersList = <T,>({
  users,
  onRefresh,
  refreshing,
  renderUser,
  onLoadMore,
}: InviteMembersProps<T>['List']) => {
  return (
    <FlatList
      data={users}
      refreshing={refreshing}
      onRefresh={onRefresh}
      renderItem={({ item }) => renderUser?.(item)}
      onEndReached={onLoadMore}
    />
  );
};

export default InviteMembersList;
