import React, { useCallback, useContext } from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { InviteMembersContext } from '../module/moduleContext';
import type { InviteMembersContextType, InviteMembersProps } from '../types';

const InviteMembersList = <T,>({
  users,
  onRefresh,
  refreshing,
  renderUser,
  onLoadNext,
}: InviteMembersProps<T>['List']) => {
  const context = useContext(InviteMembersContext.List as InviteMembersContextType<T>['List']);
  const renderItem: ListRenderItem<T> = useCallback(
    ({ item }) => renderUser?.(item, context.selectedUsers, context.setSelectedUsers),
    [renderUser, context.selectedUsers, context.setSelectedUsers],
  );

  return (
    <FlatList
      data={users}
      refreshing={refreshing}
      onRefresh={onRefresh}
      renderItem={renderItem}
      onEndReached={onLoadNext}
    />
  );
};

export default InviteMembersList;
