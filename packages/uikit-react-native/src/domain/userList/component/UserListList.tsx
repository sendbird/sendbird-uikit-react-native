import React, { useCallback, useContext } from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { UserStruct, getUserUniqId, useSafeAreaPadding } from '@sendbird/uikit-utils';

import { UserListContexts } from '../module/moduleContext';
import type { UserListContextsType, UserListProps } from '../types';

const UserListList = <T extends UserStruct>({
  users,
  onRefresh,
  refreshing,
  renderUser,
  onLoadNext,
  ListEmptyComponent,
}: UserListProps<T>['List']) => {
  const context = useContext(UserListContexts.List as UserListContextsType<T>['List']);
  const renderItem: ListRenderItem<T> = useCallback(
    ({ item }) => renderUser?.(item, context.selectedUsers, context.setSelectedUsers),
    [renderUser, context.selectedUsers, context.setSelectedUsers],
  );
  const safeArea = useSafeAreaPadding(['left', 'right']);

  return (
    <FlatList
      data={users}
      refreshing={refreshing}
      onRefresh={onRefresh}
      renderItem={renderItem}
      onEndReached={onLoadNext}
      contentContainerStyle={{ ...safeArea, flexGrow: 1 }}
      ListEmptyComponent={ListEmptyComponent}
      keyExtractor={getUserUniqId}
    />
  );
};

export default UserListList;
