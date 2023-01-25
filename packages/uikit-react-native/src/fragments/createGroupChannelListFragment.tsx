import React from 'react';

import { useGroupChannelList } from '@sendbird/uikit-chat-hooks';
import { PASS, useAppState, useFreshCallback } from '@sendbird/uikit-utils';

import StatusComposition from '../components/StatusComposition';
import GroupChannelPreviewContainer from '../containers/GroupChannelPreviewContainer';
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
    onPressChannel,
    onPressCreateChannel,
    queryCreator,
    collectionCreator,
    renderGroupChannelPreview,
    skipTypeSelection = false,
    flatListProps = {},
    menuItemCreator = PASS,
  }) => {
    const { sdk, currentUser, features, markAsDeliveredWithChannel } = useSendbirdChat();
    const { groupChannels, next, loading } = useGroupChannelList(sdk, currentUser?.userId, {
      queryCreator,
      collectionCreator,
      enableCollectionWithoutLocalCache: !queryCreator,
    });

    if (features.deliveryReceiptEnabled) {
      useAppState('change', (status) => {
        if (status === 'active') groupChannels.forEach(markAsDeliveredWithChannel);
      });
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

    const isChannelTypeAvailable = features.broadcastChannelEnabled || features.superGroupChannelEnabled;

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
          skipTypeSelection={isChannelTypeAvailable ? skipTypeSelection : true}
          onSelectType={onPressCreateChannel}
        />
      </GroupChannelListModule.Provider>
    );
  };
};

export default createGroupChannelListFragment;
