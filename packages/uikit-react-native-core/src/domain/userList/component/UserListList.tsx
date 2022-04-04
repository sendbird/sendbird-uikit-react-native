import React, { useCallback, useContext } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserListContext } from '../module/moduleContext';
import type { UserListContextType, UserListProps } from '../types';

const UserListList = <T,>({ users, onRefresh, refreshing, renderUser, onLoadNext }: UserListProps<T>['List']) => {
  const context = useContext(UserListContext.List as UserListContextType<T>['List']);
  const renderItem: ListRenderItem<T> = useCallback(
    ({ item }) => renderUser?.(item, context.selectedUsers, context.setSelectedUsers),
    [renderUser, context.selectedUsers, context.setSelectedUsers],
  );
  const { left, right } = useSafeAreaInsets();

  return (
    <FlatList
      data={users}
      refreshing={refreshing}
      onRefresh={onRefresh}
      renderItem={renderItem}
      onEndReached={onLoadNext}
      contentContainerStyle={{ paddingLeft: left, paddingRight: right }}
    />
  );
};

export default UserListList;
