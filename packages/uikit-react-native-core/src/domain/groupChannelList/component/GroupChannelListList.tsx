import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type Sendbird from 'sendbird';

import { useActionMenu, useToast } from '@sendbird/uikit-react-native-foundation';
import { PASS, useFreshCallback } from '@sendbird/uikit-utils';

import { useLocalization } from '../../../contexts/Localization';
import { useSendbirdChat } from '../../../contexts/SendbirdChat';
import type { GroupChannelListProps } from '../types';

const GroupChannelListList: React.FC<GroupChannelListProps['List']> = ({
  renderGroupChannelPreview,
  groupChannels,
  onLoadNext,
  flatListProps,
  menuItemCreator = PASS,
}) => {
  const toast = useToast();
  const { openMenu } = useActionMenu();
  const { STRINGS } = useLocalization();
  const { sdk, currentUser } = useSendbirdChat();

  const onLongPress = useFreshCallback((channel: Sendbird.GroupChannel) => {
    const action = channel.myPushTriggerOption === 'off' ? 'on' : 'off';
    const menuItem = menuItemCreator({
      title: STRINGS.GROUP_CHANNEL_LIST.DIALOG_CHANNEL_TITLE(currentUser?.userId ?? '', channel),
      menuItems: [
        {
          title: STRINGS.GROUP_CHANNEL_LIST.DIALOG_CHANNEL_NOTIFICATION(channel),
          onPress: async () => {
            if (action === 'on') {
              await channel.setMyPushTriggerOption('default');
            } else {
              await channel.setMyPushTriggerOption('off');
            }
          },
          onError: () => {
            toast.show(
              action === 'on' ? STRINGS.TOAST.TURN_ON_NOTIFICATIONS_ERROR : STRINGS.TOAST.TURN_OFF_NOTIFICATIONS_ERROR,
              'error',
            );
          },
        },
        {
          title: STRINGS.GROUP_CHANNEL_LIST.DIALOG_CHANNEL_LEAVE,
          onPress: async () => {
            channel.leave().then(() => sdk.clearCachedMessages([channel.url]).catch());
          },
          onError: () => toast.show(STRINGS.TOAST.LEAVE_CHANNEL_ERROR, 'error'),
        },
      ],
    });

    openMenu(menuItem);
  });

  const renderItem: ListRenderItem<Sendbird.GroupChannel> = useCallback(
    ({ item }) => renderGroupChannelPreview?.(item, () => onLongPress(item)),
    [renderGroupChannelPreview, onLongPress],
  );

  const { left, right } = useSafeAreaInsets();
  return (
    <FlatList
      bounces={false}
      data={groupChannels}
      renderItem={renderItem}
      onEndReached={onLoadNext}
      {...flatListProps}
      contentContainerStyle={[flatListProps?.contentContainerStyle, { paddingLeft: left, paddingRight: right }]}
    />
  );
};

export default GroupChannelListList;
