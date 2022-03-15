import React, { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import type Sendbird from 'sendbird';

import { useGroupChannelList } from '@sendbird/chat-react-hooks';
import type { GroupChannelListFragment, GroupChannelListModule } from '@sendbird/uikit-react-native-core';
import { createGroupChannelListModule, useLocalization, useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { Logger, channelComparator } from '@sendbird/uikit-utils';

import GroupChannelPreview from '../ui/GroupChannelPreview';
import TypedPlaceholder from '../ui/TypedPlaceholder';

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
    const { sdk, currentUser } = useSendbirdChat();
    const { groupChannels, refresh, refreshing, next } = useGroupChannelList(sdk, currentUser?.userId, {
      queryCreator,
      sortComparator,
      enableCollectionWithoutLocalCache: true,
    });

    const { LABEL } = useLocalization();

    const renderGroupChannelPreview = useCallback(
      (channel: Sendbird.GroupChannel, selectChannel) => (
        <Pressable onPress={() => onPressChannel(channel)} onLongPress={() => selectChannel(channel)}>
          <GroupChannelPreview
            coverUrl={channel.coverUrl}
            title={LABEL.GROUP_CHANNEL_LIST.FRAGMENT.PREVIEW_TITLE(currentUser?.userId ?? '', channel)}
            titleCaption={LABEL.GROUP_CHANNEL_LIST.FRAGMENT.PREVIEW_TITLE_CAPTION(channel)}
            body={LABEL.GROUP_CHANNEL_LIST.FRAGMENT.PREVIEW_BODY(channel)}
            badgeCount={channel.unreadMessageCount}
            bodyIcon={channel.lastMessage?.isFileMessage() ? 'file-document' : undefined}
            frozen={channel.isFrozen}
            notificationOff={channel.myPushTriggerOption === 'off'}
            memberCount={channel.memberCount}
          />
        </Pressable>
      ),
      [LABEL, onPressChannel, currentUser?.userId],
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
                <TypedPlaceholder type={'no-channels'} />
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
