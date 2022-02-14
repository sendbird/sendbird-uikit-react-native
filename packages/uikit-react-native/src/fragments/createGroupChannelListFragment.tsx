import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import type Sendbird from 'sendbird';

import { useGroupChannelList } from '@sendbird/chat-react-hooks';
import type {
  GroupChannelListFragment,
  GroupChannelListHeaderProps,
  GroupChannelListModule,
} from '@sendbird/uikit-react-native-core';
import { createGroupChannelListModule, useLocalization, useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { Logger } from '@sendbird/uikit-utils';

import GroupChannelPreviewUI from '../ui/GroupChannelPreview';
import SBHeader from '../ui/SBHeader';
import SBIcon from '../ui/SBIcon';

const createGroupChannelListFragment = (initModule?: Partial<GroupChannelListModule>): GroupChannelListFragment => {
  const module = createGroupChannelListModule(initModule);

  return ({
    Header = ({ title, right }) => SBHeader({ title, left: null, right }),
    onPressChannel,
    onPressCreateChannel,
  }) => {
    const { sdk, currentUser } = useSendbirdChat();
    const { groupChannels, refresh, refreshing, loadMore } = useGroupChannelList(sdk, currentUser?.userId);

    const renderGroupChannelPreview = useCallback(
      (channel: Sendbird.GroupChannel) => (
        <GroupChannelPreview currentUserId={currentUser?.userId || ''} channel={channel} onPress={onPressChannel} />
      ),
      [onPressChannel, currentUser?.userId],
    );

    if (!currentUser) {
      Logger.warn('User is not connected');
      return null;
    }

    return (
      <module.Provider>
        <HeaderRenderer Header={Header} Context={module.Context} onPressCreateChannel={onPressCreateChannel} />
        <module.List
          refreshing={refreshing}
          renderGroupChannelPreview={renderGroupChannelPreview}
          groupChannels={groupChannels}
          onLoadMore={loadMore}
          onRefresh={refresh}
        />
      </module.Provider>
    );
  };
};

const HeaderRenderer: React.FC<GroupChannelListHeaderProps> = ({ Header, onPressCreateChannel }) => {
  const { LABEL } = useLocalization();
  if (!Header) return null;
  return (
    <Header
      title={LABEL.GROUP_CHANNEL.LIST.HEADER_TITLE}
      right={
        <Pressable onPress={onPressCreateChannel}>
          <SBIcon icon={'create'} />
        </Pressable>
      }
    />
  );
};

const GroupChannelPreview: React.FC<{
  channel: Sendbird.GroupChannel;
  onPress: (channel: Sendbird.GroupChannel) => void;
  currentUserId: string;
}> = React.memo(({ channel, onPress, currentUserId }) => {
  const { LABEL } = useLocalization();

  return (
    <GroupChannelPreviewUI
      onPress={() => onPress(channel)}
      coverUrl={channel.coverUrl}
      title={LABEL.GROUP_CHANNEL.LIST.PREVIEW_TITLE(currentUserId, channel)}
      titleCaption={LABEL.GROUP_CHANNEL.LIST.PREVIEW_TITLE_CAPTION(channel)}
      body={LABEL.GROUP_CHANNEL.LIST.PREVIEW_BODY(channel)}
      badgeCount={channel.unreadMessageCount}
      frozen={channel.isFrozen}
      bodyIcon={channel.lastMessage?.isFileMessage() ? 'file-document' : undefined}
      muted={channel.myMutedState === 'muted'}
      memberCount={channel.memberCount}
    />
  );
});

export default createGroupChannelListFragment;
