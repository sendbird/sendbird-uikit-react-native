import React, { useCallback, useContext } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import type Sendbird from 'sendbird';

import { GroupChannelListContext } from '../module/moduleContext';
import type { GroupChannelListProps } from '../types';

const GroupChannelListList: React.FC<GroupChannelListProps['List']> = ({
  renderGroupChannelPreview,
  groupChannels,
  onLoadNext,
  refreshing,
  onRefresh,
  flatListProps,
}) => {
  const channelMenu = useContext(GroupChannelListContext.ChannelMenu);
  const renderItem: ListRenderItem<Sendbird.GroupChannel> = useCallback(
    ({ item }) => renderGroupChannelPreview?.(item, channelMenu.selectChannel),
    [renderGroupChannelPreview, channelMenu.selectChannel],
  );
  return (
    <FlatList
      data={groupChannels}
      refreshing={refreshing}
      onRefresh={onRefresh}
      renderItem={renderItem}
      onEndReached={onLoadNext}
      {...flatListProps}
    />
  );
};

export default GroupChannelListList;
