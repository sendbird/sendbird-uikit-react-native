import React, { useContext } from 'react';
import { FlatList } from 'react-native';

import { GroupChannelListContext } from '../module/moduleContext';
import type { GroupChannelListProps } from '../types';

const GroupChannelListList: React.FC<GroupChannelListProps['List']> = ({
  renderGroupChannelPreview,
  groupChannels,
  onLoadMore,
  refreshing,
  onRefresh,
  flatListProps,
}) => {
  const channelMenu = useContext(GroupChannelListContext.ChannelMenu);
  return (
    <FlatList
      data={groupChannels}
      refreshing={refreshing}
      onRefresh={onRefresh}
      renderItem={({ item }) => renderGroupChannelPreview?.(item, channelMenu.selectChannel)}
      onEndReached={onLoadMore}
      {...flatListProps}
    />
  );
};

export default GroupChannelListList;
