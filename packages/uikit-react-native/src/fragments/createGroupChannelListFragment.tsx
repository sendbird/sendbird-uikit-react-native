import React, { useCallback } from 'react';
import { Pressable, View } from 'react-native';

import { useGroupChannelList } from '@sendbird/uikit-chat-hooks';
import type {
  GroupChannelListFragment,
  GroupChannelListModule,
  GroupChannelListProps,
} from '@sendbird/uikit-react-native-core';
import { createGroupChannelListModule, useLocalization, useSendbirdChat } from '@sendbird/uikit-react-native-core';
import { Avatar } from '@sendbird/uikit-react-native-foundation';
import {
  Logger,
  channelComparator,
  conditionChaining,
  getMembersExcludeMe,
  preferDefaultChannelCover,
} from '@sendbird/uikit-utils';

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
    const { groupChannels, refresh, refreshing, next, loading } = useGroupChannelList(sdk, currentUser?.userId, {
      queryCreator,
      sortComparator,
      enableCollectionWithoutLocalCache: true,
    });

    const { STRINGS } = useLocalization();

    const renderGroupChannelPreview: GroupChannelListProps['List']['renderGroupChannelPreview'] = useCallback(
      (channel, onLongPressChannel) => (
        <Pressable onPress={() => onPressChannel(channel)} onLongPress={onLongPressChannel}>
          <GroupChannelPreview
            customCover={conditionChaining(
              [preferDefaultChannelCover(channel)],
              [
                <Avatar uri={channel.coverUrl} size={56} />,
                <Avatar.Group size={56}>
                  {getMembersExcludeMe(channel, currentUser?.userId).map((m) => (
                    <Avatar key={m.userId} uri={m.profileUrl} />
                  ))}
                </Avatar.Group>,
              ],
            )}
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
