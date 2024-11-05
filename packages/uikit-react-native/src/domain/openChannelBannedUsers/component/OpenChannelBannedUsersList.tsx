import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { SendbirdRestrictedUser, getUserUniqId, useFreshCallback, useSafeAreaPadding } from '@sendbird/uikit-utils';

import type { OpenChannelBannedUsersProps } from '../types';

const OpenChannelBannedUsersList = ({
  renderUser,
  bannedUsers,
  onLoadNext,
  ListEmptyComponent,
}: OpenChannelBannedUsersProps['List']) => {
  const renderItem: ListRenderItem<SendbirdRestrictedUser> = useFreshCallback(({ item }) =>
    renderUser?.({ user: item }),
  );
  const safeArea = useSafeAreaPadding(['left', 'right']);

  return (
    <FlatList
      data={bannedUsers}
      renderItem={renderItem}
      contentContainerStyle={{ ...safeArea, flexGrow: 1 }}
      ListEmptyComponent={ListEmptyComponent}
      onEndReached={onLoadNext}
      bounces={false}
      keyExtractor={getUserUniqId}
    />
  );
};

export default OpenChannelBannedUsersList;
