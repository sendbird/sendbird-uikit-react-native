import React from 'react';

import { GroupChannelCollection, GroupChannelFilter } from '@sendbird/chat/groupChannel';
import { useGroupChannelList } from '@sendbird/uikit-tools';
import { PASS, SendbirdChatSDK, confirmAndMarkAsDelivered, useAppState, useFreshCallback } from '@sendbird/uikit-utils';

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
    renderGroupChannelPreview,
    skipTypeSelection = false,
    flatListProps = {},
    menuItemCreator = PASS,
    channelListQueryParams,
    collectionCreator,
  }) => {
    const { sdk, sbOptions, markAsDeliveredWithChannel } = useSendbirdChat();
    const { groupChannels, loadMore, initialized } = useGroupChannelList(sdk, {
      collectionCreator: getCollectionCreator(sdk, channelListQueryParams, collectionCreator),
      markAsDelivered: confirmAndMarkAsDelivered,
    });

    useAppState('change', (status) => {
      if (sbOptions.appInfo.deliveryReceiptEnabled) {
        if (status === 'active') groupChannels.forEach(markAsDeliveredWithChannel);
      }
    });

    const _renderGroupChannelPreview: GroupChannelListProps['List']['renderGroupChannelPreview'] = useFreshCallback(
      (props) => {
        if (renderGroupChannelPreview) return renderGroupChannelPreview(props);
        return <GroupChannelPreviewContainer {...props} />;
      },
    );

    const isChannelTypeAvailable =
      sbOptions.appInfo.broadcastChannelEnabled || sbOptions.appInfo.superGroupChannelEnabled;

    return (
      <GroupChannelListModule.Provider>
        <GroupChannelListModule.Header />
        <StatusComposition loading={!initialized} LoadingComponent={<GroupChannelListModule.StatusLoading />}>
          <GroupChannelListModule.List
            onPressChannel={onPressChannel}
            menuItemCreator={menuItemCreator}
            renderGroupChannelPreview={_renderGroupChannelPreview}
            groupChannels={groupChannels}
            onLoadNext={loadMore}
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

function getCollectionCreator(
  sdk: SendbirdChatSDK,
  channelListQueryParams?: GroupChannelListProps['Fragment']['channelListQueryParams'],
  deprecatedCreatorProp?: () => GroupChannelCollection,
) {
  if (!channelListQueryParams && deprecatedCreatorProp) return deprecatedCreatorProp;

  return (defaultParams: GroupChannelListProps['Fragment']['channelListQueryParams']) => {
    const params = { ...defaultParams, ...channelListQueryParams };
    return sdk.groupChannel.createGroupChannelCollection({
      ...params,
      filter: new GroupChannelFilter(params),
    });
  };
}

export default createGroupChannelListFragment;
