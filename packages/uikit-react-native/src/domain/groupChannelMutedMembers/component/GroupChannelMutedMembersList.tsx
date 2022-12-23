import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SendbirdRestrictedUser, getUserUniqId, useFreshCallback } from '@sendbird/uikit-utils';

import type { GroupChannelMutedMembersProps } from '../types';

const GroupChannelMutedMembersList = ({
  renderUser,
  mutedMembers,
  ListEmptyComponent,
}: GroupChannelMutedMembersProps['List']) => {
  const renderItem: ListRenderItem<SendbirdRestrictedUser> = useFreshCallback(({ item }) =>
    renderUser?.({ user: item }),
  );
  const { left, right } = useSafeAreaInsets();

  return (
    <FlatList
      data={mutedMembers}
      renderItem={renderItem}
      contentContainerStyle={{ paddingLeft: left, paddingRight: right, flexGrow: 1 }}
      ListEmptyComponent={ListEmptyComponent}
      bounces={false}
      keyExtractor={getUserUniqId}
    />
  );
};

export default GroupChannelMutedMembersList;
