import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { SendbirdRestrictedUser, getUserUniqId, useFreshCallback, useSafeAreaPadding } from '@sendbird/uikit-utils';

import type { GroupChannelMutedMembersProps } from '../types';

const GroupChannelMutedMembersList = ({
  renderUser,
  mutedMembers,
  ListEmptyComponent,
  onLoadNext,
}: GroupChannelMutedMembersProps['List']) => {
  const renderItem: ListRenderItem<SendbirdRestrictedUser> = useFreshCallback(({ item }) =>
    renderUser?.({ user: item }),
  );
  const safeArea = useSafeAreaPadding(['left', 'right']);

  return (
    <FlatList
      data={mutedMembers}
      renderItem={renderItem}
      contentContainerStyle={{ ...safeArea, flexGrow: 1 }}
      ListEmptyComponent={ListEmptyComponent}
      bounces={false}
      keyExtractor={getUserUniqId}
      onEndReached={onLoadNext}
    />
  );
};

export default GroupChannelMutedMembersList;
