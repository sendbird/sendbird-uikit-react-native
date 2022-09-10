import React, { useEffect } from 'react';
import { AppState } from 'react-native';

import { useGroupChannelList } from '@sendbird/uikit-chat-hooks';
import { Logger, PASS, channelComparator, useFreshCallback } from '@sendbird/uikit-utils';

import GroupChannelPreviewContainer from '../components/GroupChannelPreviewContainer';
import StatusComposition from '../components/StatusComposition';
import createGroupChannelListModule from '../domain/groupChannelList/module/createGroupChannelListModule';
import type {
  GroupChannelListFragment,
  GroupChannelListModule,
  GroupChannelListProps,
} from '../domain/groupChannelList/types';
import { useSendbirdChat } from '../hooks/useContext';

const createGroupChannelListFragment = (initModule?: Partial<GroupChannelListModule>): GroupChannelListFragment => {
  const GroupChannelListModule = createGroupChannelListModule(initModule);
  return ({
    TypeSelectorHeader,
    onPressChannel,
    onPressCreateChannel,
    queryCreator,
    collectionCreator,
    sortComparator = channelComparator,
    renderGroupChannelPreview,
    // skipTypeSelection = true,
    flatListProps = {},
    menuItemCreator = PASS,
  }) => {
    const { sdk, currentUser, features, markAsDeliveredWithChannel } = useSendbirdChat();
    const { groupChannels, next, loading } = useGroupChannelList(sdk, currentUser?.userId, {
      queryCreator,
      collectionCreator,
      sortComparator,
      enableCollectionWithoutLocalCache: !queryCreator,
    });

    if (features.deliveryReceiptEnabled) {
      useEffect(() => {
        const listener = AppState.addEventListener('change', (status) => {
          if (status === 'active') groupChannels.forEach(markAsDeliveredWithChannel);
        });
        return () => listener.remove();
      }, []);
    }

    const _renderGroupChannelPreview: GroupChannelListProps['List']['renderGroupChannelPreview'] = useFreshCallback(
      (channel, onLongPressChannel) => {
        if (renderGroupChannelPreview) return renderGroupChannelPreview(channel, onLongPressChannel);
        return (
          <GroupChannelPreviewContainer
            channel={channel}
            onPress={() => onPressChannel(channel)}
            onLongPress={() => onLongPressChannel()}
          />
        );
      },
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
