import React, { useCallback, useContext } from 'react';
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
import DefaultHeader from '../ui/Header';
import Icon from '../ui/Icon';

const createGroupChannelListFragment = (initModule?: Partial<GroupChannelListModule>): GroupChannelListFragment => {
  const GroupChannelListModule = createGroupChannelListModule(initModule);

  return ({ Header = DefaultHeader, onPressChannel, onPressCreateChannel }) => {
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
      <GroupChannelListModule.Provider>
        <GroupChannelListFragmentHeader
          Header={Header}
          Context={GroupChannelListModule.Context}
          onPressCreateChannel={onPressCreateChannel}
        />
        <GroupChannelListModule.List
          refreshing={refreshing}
          renderGroupChannelPreview={renderGroupChannelPreview}
          groupChannels={groupChannels}
          onLoadMore={loadMore}
          onRefresh={refresh}
        />
      </GroupChannelListModule.Provider>
    );
  };
};

export const GroupChannelListFragmentHeader: React.FC<GroupChannelListHeaderProps> = ({
  Header,
  Context,
  onPressCreateChannel,
}) => {
  const { header } = useContext(Context);
  if (!Header) return null;
  return <Header title={header.title} right={<Icon icon={'create'} />} onPressRight={onPressCreateChannel} />;
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
