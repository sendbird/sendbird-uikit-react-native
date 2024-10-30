import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { PushTriggerOption } from '@sendbird/chat';
import { useActionMenu, useToast } from '@sendbird/uikit-react-native-foundation';
import {
  NOOP,
  PASS,
  SendbirdGroupChannel,
  getChannelUniqId,
  useFreshCallback,
  useSafeAreaPadding,
} from '@sendbird/uikit-utils';

import { useLocalization, useSendbirdChat } from '../../../hooks/useContext';
import type { GroupChannelListProps } from '../types';

const GroupChannelListList = ({
  onPressChannel,
  renderGroupChannelPreview,
  groupChannels,
  onLoadNext,
  flatListProps,
  menuItemCreator = PASS,
}: GroupChannelListProps['List']) => {
  const toast = useToast();
  const { openMenu } = useActionMenu();
  const { STRINGS } = useLocalization();
  const { sdk, currentUser } = useSendbirdChat();

  const onLongPress = useFreshCallback((channel: SendbirdGroupChannel) => {
    const action = channel.myPushTriggerOption === 'off' ? 'on' : 'off';
    const menuItem = menuItemCreator({
      title: STRINGS.GROUP_CHANNEL_LIST.DIALOG_CHANNEL_TITLE(currentUser?.userId ?? '', channel),
      menuItems: [
        {
          title: STRINGS.GROUP_CHANNEL_LIST.DIALOG_CHANNEL_NOTIFICATION(channel),
          onPress: async () => {
            if (action === 'on') {
              await channel.setMyPushTriggerOption(PushTriggerOption.DEFAULT);
            } else {
              await channel.setMyPushTriggerOption(PushTriggerOption.OFF);
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
            channel.leave().then(() => sdk.clearCachedMessages([channel.url]).catch(NOOP));
          },
          onError: () => toast.show(STRINGS.TOAST.LEAVE_CHANNEL_ERROR, 'error'),
        },
      ],
    });

    openMenu(menuItem);
  });

  const renderItem: ListRenderItem<SendbirdGroupChannel> = useFreshCallback(({ item }) =>
    renderGroupChannelPreview?.({
      channel: item,
      onPress: () => onPressChannel(item),
      onLongPress: () => onLongPress(item),
    }),
  );

  const safeArea = useSafeAreaPadding(['left', 'right']);
  return (
    <FlatList
      bounces={false}
      data={groupChannels}
      renderItem={renderItem}
      onEndReached={onLoadNext}
      {...flatListProps}
      contentContainerStyle={[flatListProps?.contentContainerStyle, safeArea]}
      keyExtractor={getChannelUniqId}
    />
  );
};

export default GroupChannelListList;
