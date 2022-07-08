import React, { useCallback, useEffect } from 'react';
import { AppState, Pressable, View } from 'react-native';

import { useGroupChannelList } from '@sendbird/uikit-chat-hooks';
import type {
  GroupChannelListFragment,
  GroupChannelListModule,
  GroupChannelListProps,
} from '@sendbird/uikit-react-native-core';
import {
  ChannelCover,
  TypedPlaceholder,
  createGroupChannelListModule,
  useLocalization,
  useSendbirdChat,
} from '@sendbird/uikit-react-native-core';
import { Logger, channelComparator } from '@sendbird/uikit-utils';

import { DEFAULT_LONG_PRESS_DELAY } from '../constants';
import GroupChannelPreview from '../ui/GroupChannelPreview';

const createGroupChannelListFragment = (initModule?: Partial<GroupChannelListModule>): GroupChannelListFragment => {
  const GroupChannelListModule = createGroupChannelListModule(initModule);
  return ({
    Header,
    TypeSelectorHeader,
    onPressChannel,
    onPressCreateChannel,
    queryCreator,
    sortComparator = channelComparator,
    // skipTypeSelection = true,
    flatListProps = {},
    children,
  }) => {
    const { sdk, currentUser, features, markAsDeliveredWithChannel } = useSendbirdChat();
    const { STRINGS } = useLocalization();
    const { groupChannels, refresh, refreshing, next, loading } = useGroupChannelList(sdk, currentUser?.userId, {
      queryCreator,
      sortComparator,
      enableCollectionWithoutLocalCache: true,
    });

    if (features.deliveryReceiptEnabled) {
      useEffect(() => {
        const listener = AppState.addEventListener('change', (status) => {
          if (status === 'active') groupChannels.forEach(markAsDeliveredWithChannel);
        });
        return () => listener.remove();
      }, []);
    }

    const renderGroupChannelPreview: GroupChannelListProps['List']['renderGroupChannelPreview'] = useCallback(
      (channel, onLongPressChannel) => (
        <Pressable
          onPress={() => onPressChannel(channel)}
          onLongPress={onLongPressChannel}
          delayLongPress={DEFAULT_LONG_PRESS_DELAY}
        >
          <GroupChannelPreview
            customCover={<ChannelCover channel={channel} size={56} />}
            coverUrl={channel.coverUrl}
            title={STRINGS.GROUP_CHANNEL_LIST.CHANNEL_PREVIEW_TITLE(currentUser?.userId ?? '', channel)}
            titleCaption={STRINGS.GROUP_CHANNEL_LIST.CHANNEL_PREVIEW_TITLE_CAPTION(channel)}
            body={STRINGS.GROUP_CHANNEL_LIST.CHANNEL_PREVIEW_BODY(channel)}
            badgeCount={channel.unreadMessageCount}
            bodyIcon={channel.lastMessage?.isFileMessage() ? 'file-document' : undefined}
            frozen={channel.isFrozen}
            notificationOff={channel.myPushTriggerOption === 'off'}
            memberCount={channel.memberCount > 2 ? channel.memberCount : undefined}
          />
        </Pressable>
      ),
      [STRINGS, onPressChannel, currentUser?.userId],
    );

    if (!currentUser) {
      Logger.warn('Cannot render GroupChannelListFragment, User is not connected');
      return null;
    }

    return (
      <GroupChannelListModule.Provider>
        <GroupChannelListModule.Header Header={Header} />
        <GroupChannelListModule.List
          refreshing={refreshing}
          renderGroupChannelPreview={renderGroupChannelPreview}
          groupChannels={groupChannels}
          onLoadNext={next}
          onRefresh={refresh}
          flatListProps={{
            ListEmptyComponent: (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TypedPlaceholder type={loading ? 'loading' : 'no-channels'} />
              </View>
            ),
            contentContainerStyle: { flexGrow: 1 },
            ...flatListProps,
          }}
        />
        <GroupChannelListModule.TypeSelector
          // NOTE: not included in first iteration
          skipTypeSelection
          Header={TypeSelectorHeader}
          onSelectType={onPressCreateChannel}
        />
        <GroupChannelListModule.ChannelMenu />
        {children}
      </GroupChannelListModule.Provider>
    );
  };
};

export default createGroupChannelListFragment;
