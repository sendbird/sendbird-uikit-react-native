import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SendbirdRestrictedUser, getUserUniqId, useFreshCallback } from '@sendbird/uikit-utils';

import type { GroupChannelBannedUsersProps } from '../types';

const GroupChannelBannedUsersList = ({
  renderUser,
  bannedUsers,
  onLoadNext,
  ListEmptyComponent,
}: GroupChannelBannedUsersProps['List']) => {
  const renderItem: ListRenderItem<SendbirdRestrictedUser> = useFreshCallback(({ item }) =>
    renderUser?.({ user: item }),
  );
  const { left, right } = useSafeAreaInsets();

  return (
    <FlatList
      data={bannedUsers}
      renderItem={renderItem}
      contentContainerStyle={{ paddingLeft: left, paddingRight: right, flexGrow: 1 }}
      ListEmptyComponent={ListEmptyComponent}
      onEndReached={onLoadNext}
      bounces={false}
      keyExtractor={getUserUniqId}
    />
  );
};

export default GroupChannelBannedUsersList;
