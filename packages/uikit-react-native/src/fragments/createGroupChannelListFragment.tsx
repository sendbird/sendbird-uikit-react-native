import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import type Sendbird from 'sendbird';

import { useGroupChannelList } from '@sendbird/chat-react-hooks';
import type { GroupChannelListFragment, GroupChannelListModule } from '@sendbird/uikit-react-native-core';
import { createGroupChannelListModule, useLocalization, useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { Logger, channelComparator } from '@sendbird/uikit-utils';

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
    skipTypeSelection = true,
    flatListProps = {},
    children,
  }) => {
    const { sdk, currentUser } = useSendbirdChat();
    const { groupChannels, refresh, refreshing, next } = useGroupChannelList(sdk, currentUser?.userId, {
      queryCreator,
      sortComparator,
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
            frozen={channel.isFrozen}
            bodyIcon={channel.lastMessage?.isFileMessage() ? 'file-document' : undefined}
            muted={channel.myMutedState === 'muted'}
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
          flatListProps={flatListProps}
        />
        <GroupChannelListModule.TypeSelector
          Header={TypeSelectorHeader}
          skipTypeSelection={skipTypeSelection}
          onSelectType={onPressCreateChannel}
        />
        <GroupChannelListModule.ChannelMenu />
        {children}
      </GroupChannelListModule.Provider>
    );
  };
};

export default createGroupChannelListFragment;
