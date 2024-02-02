import type React from 'react';
import type { FlatListProps } from 'react-native';

import type { GroupChannelCollectionParams, GroupChannelFilterParams } from '@sendbird/chat/groupChannel';
import type { UseGroupChannelListOptions } from '@sendbird/uikit-chat-hooks';
import type { ActionMenuItem } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdGroupChannel } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export type ChannelListQueryParamsType = Omit<GroupChannelCollectionParams, 'filter'> & GroupChannelFilterParams;
export interface GroupChannelListProps {
  Fragment: {
    onPressChannel: GroupChannelListProps['List']['onPressChannel'];
    onPressCreateChannel: (channelType: GroupChannelType) => void;
    renderGroupChannelPreview?: GroupChannelListProps['List']['renderGroupChannelPreview'];
    skipTypeSelection?: boolean;
    flatListProps?: GroupChannelListProps['List']['flatListProps'];
    menuItemCreator?: GroupChannelListProps['List']['menuItemCreator'];
    /**
     * @description You can specify the query parameters for the channel list.
     * @example
     * ```
     * <GroupChannelListFragment channelListQueryParams={{ limit: 20, includeEmpty: false }} />
     * ```
     * */
    channelListQueryParams?: ChannelListQueryParamsType;
    /** @deprecated Please use `channelListQueryParams` instead */
    collectionCreator?: UseGroupChannelListOptions['collectionCreator'];
  };
  Header: {};
  List: {
    onPressChannel: (channel: SendbirdGroupChannel) => void;
    groupChannels: SendbirdGroupChannel[];
    renderGroupChannelPreview: (props: {
      channel: SendbirdGroupChannel;
      onPress: () => void;
      onLongPress: () => void;
    }) => React.ReactElement | null;
    onLoadNext: () => Promise<void>;
    flatListProps?: Omit<FlatListProps<SendbirdGroupChannel>, 'data' | 'renderItem'>;
    menuItemCreator?: (defaultMenuItem: ActionMenuItem) => ActionMenuItem;
  };
  TypeSelector: {
    skipTypeSelection: boolean;
    onSelectType: (type: GroupChannelType) => void;
  };
}

/**
 * Internal context for GroupChannelList
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export interface GroupChannelListContextsType {
  Fragment: React.Context<{
    headerTitle: string;
  }>;
  TypeSelector: React.Context<{
    visible: boolean;
    show: () => void;
    hide: () => void;
    headerTitle: string;
  }>;
}
export interface GroupChannelListModule {
  Provider: CommonComponent;
  Header: CommonComponent<GroupChannelListProps['Header']>;
  List: CommonComponent<GroupChannelListProps['List']>;
  TypeSelector: CommonComponent<GroupChannelListProps['TypeSelector']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
}

export type GroupChannelListFragment = React.FC<GroupChannelListProps['Fragment']>;
export type GroupChannelType = 'GROUP' | 'SUPER_GROUP' | 'BROADCAST';
