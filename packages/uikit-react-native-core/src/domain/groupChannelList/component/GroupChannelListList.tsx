import React, { useCallback, useContext } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type Sendbird from 'sendbird';

import { GroupChannelListContext } from '../module/moduleContext';
import type { GroupChannelListProps } from '../types';

const GroupChannelListList: React.FC<GroupChannelListProps['List']> = ({
  renderGroupChannelPreview,
  groupChannels,
  onLoadNext,
  // refreshing,
  // onRefresh,
  flatListProps,
}) => {
  const channelMenu = useContext(GroupChannelListContext.ChannelMenu);
  const renderItem: ListRenderItem<Sendbird.GroupChannel> = useCallback(
    ({ item }) => renderGroupChannelPreview?.(item, () => channelMenu.selectChannel(item)),
    [renderGroupChannelPreview, channelMenu.selectChannel],
  );
  const { left, right } = useSafeAreaInsets();
  return (
    <FlatList
      bounces={false}
      data={groupChannels}
      // refreshing={refreshing}
      // onRefresh={onRefresh}
      renderItem={renderItem}
      onEndReached={onLoadNext}
      {...flatListProps}
      contentContainerStyle={[flatListProps?.contentContainerStyle, { paddingLeft: left, paddingRight: right }]}
    />
  );
};

export default GroupChannelListList;
