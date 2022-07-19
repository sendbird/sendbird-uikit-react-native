import React, { useCallback, useEffect } from 'react';
import { AppState, Pressable } from 'react-native';

import { useGroupChannelList } from '@sendbird/uikit-chat-hooks';
import { GroupChannelPreview } from '@sendbird/uikit-react-native-foundation';
import { Logger, PASS, channelComparator, getFileExtension, getFileType } from '@sendbird/uikit-utils';

import ChannelCover from '../components/ChannelCover';
import StatusComposition from '../components/StatusComposition';
import { DEFAULT_LONG_PRESS_DELAY } from '../constants';
import createGroupChannelListModule from '../domain/groupChannelList/module/createGroupChannelListModule';
import type {
  GroupChannelListFragment,
  GroupChannelListModule,
  GroupChannelListProps,
} from '../domain/groupChannelList/types';
import { useLocalization, useSendbirdChat } from '../hooks/useContext';

const iconMapper = { audio: 'file-audio', image: 'photo', video: 'play', file: 'file-document' } as const;
const createGroupChannelListFragment = (initModule?: Partial<GroupChannelListModule>): GroupChannelListFragment => {
  const GroupChannelListModule = createGroupChannelListModule(initModule);
  return ({
    TypeSelectorHeader,
    onPressChannel,
    onPressCreateChannel,
    queryCreator,
    sortComparator = channelComparator,
    renderGroupChannelPreview,
    // skipTypeSelection = true,
    flatListProps = {},
    menuItemCreator = PASS,
  }) => {
    const { sdk, currentUser, features, markAsDeliveredWithChannel } = useSendbirdChat();
    const { STRINGS } = useLocalization();
    const { groupChannels, next, loading } = useGroupChannelList(sdk, currentUser?.userId, {
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

    const _renderGroupChannelPreview: GroupChannelListProps['List']['renderGroupChannelPreview'] = useCallback(
      (channel, onLongPressChannel) => {
        if (renderGroupChannelPreview) return renderGroupChannelPreview(channel, onLongPressChannel);
        return (
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
              bodyIcon={
                channel.lastMessage?.isFileMessage()
                  ? iconMapper[getFileType(channel.lastMessage.type || getFileExtension(channel.lastMessage.name))]
                  : undefined
              }
              frozen={channel.isFrozen}
              notificationOff={channel.myPushTriggerOption === 'off'}
              memberCount={channel.memberCount > 2 ? channel.memberCount : undefined}
            />
          </Pressable>
        );
      },
      [STRINGS, onPressChannel, currentUser?.userId],
    );

    if (!currentUser) {
      Logger.warn('Cannot render GroupChannelListFragment, User is not connected');
      return null;
    }

    return (
      <GroupChannelListModule.Provider>
        <GroupChannelListModule.Header />
        <StatusComposition loading={loading} LoadingComponent={<GroupChannelListModule.StatusLoading />}>
          <GroupChannelListModule.List
            menuItemCreator={menuItemCreator}
            renderGroupChannelPreview={_renderGroupChannelPreview}
            groupChannels={groupChannels}
            onLoadNext={next}
            flatListProps={{
              ListEmptyComponent: <GroupChannelListModule.StatusEmpty />,
              contentContainerStyle: { flexGrow: 1 },
              ...flatListProps,
            }}
          />
        </StatusComposition>
        <GroupChannelListModule.TypeSelector
          // NOTE: not included in first iteration
          skipTypeSelection
          Header={TypeSelectorHeader}
          onSelectType={onPressCreateChannel}
        />
      </GroupChannelListModule.Provider>
    );
  };
};

export default createGroupChannelListFragment;
