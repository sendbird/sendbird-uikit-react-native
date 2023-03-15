import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SendbirdRestrictedUser, getUserUniqId, useFreshCallback } from '@sendbird/uikit-utils';

import type { OpenChannelMutedParticipantsProps } from '../types';

const OpenChannelMutedParticipantsList = ({
  renderUser,
  mutedParticipants,
  ListEmptyComponent,
  onLoadNext,
}: OpenChannelMutedParticipantsProps['List']) => {
  const renderItem: ListRenderItem<SendbirdRestrictedUser> = useFreshCallback(({ item }) =>
    renderUser?.({ user: item }),
  );
  const { left, right } = useSafeAreaInsets();

  return (
    <FlatList
      data={mutedParticipants}
      renderItem={renderItem}
      contentContainerStyle={{ paddingLeft: left, paddingRight: right, flexGrow: 1 }}
      ListEmptyComponent={ListEmptyComponent}
      bounces={false}
      keyExtractor={getUserUniqId}
      onEndReached={onLoadNext}
    />
  );
};

export default OpenChannelMutedParticipantsList;
