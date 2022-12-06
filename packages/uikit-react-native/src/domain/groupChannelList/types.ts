import type React from 'react';
import type { FlatListProps } from 'react-native';

import type { UseGroupChannelListOptions } from '@sendbird/uikit-chat-hooks';
import type { ActionMenuItem } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdGroupChannel } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export interface GroupChannelListProps {
  /** Props for `GroupChannelListFragment` **/
  Fragment: {
    /** Navigate to GroupChannelFragment **/
    onPressChannel: (channel: SendbirdGroupChannel) => void;
    /** Navigate to GroupChannelCreateFragment **/
    onPressCreateChannel: (channelType: GroupChannelType) => void;
    /** Method to render GroupChannel preview **/
    renderGroupChannelPreview?: (
      channel: SendbirdGroupChannel,
      onLongPressChannel: () => void,
    ) => React.ReactElement | null;
    /** Skip type selection, When this is set to true 'channelType' only receive 'GROUP' type **/
    skipTypeSelection?: boolean;
    /** Custom Query creator for channels query **/
    queryCreator?: UseGroupChannelListOptions['queryCreator'];
    /** Custom Collection creator for group channel collection **/
    collectionCreator?: UseGroupChannelListOptions['collectionCreator'];
    /** FlatList props for GroupChannelList.List **/
    flatListProps?: GroupChannelListProps['List']['flatListProps'];
    /** Action menu item creator for onLongPress **/
    menuItemCreator?: GroupChannelListProps['List']['menuItemCreator'];
  };
  /** Props for `GroupChannelListModule.Header` **/
  Header: {};
  /** Props for `GroupChannelListModule.List` **/
  List: {
    /** GroupChannels from SendbirdChat SDK **/
    groupChannels: SendbirdGroupChannel[];
    /** Method to render GroupChannel preview **/
    renderGroupChannelPreview: (
      // FIXME/BREAKING: Changed to props object
      channel: SendbirdGroupChannel,
      onLongPressChannel: () => void,
    ) => React.ReactElement | null;
    /** Method to load more data, called with onEndReached of FlatList **/
    onLoadNext: () => Promise<void>;
    /** Prop from Fragment **/
    flatListProps?: Omit<FlatListProps<SendbirdGroupChannel>, 'data' | 'renderItem'>;
    /** Prop from Fragment **/
    menuItemCreator?: (defaultMenuItem: ActionMenuItem) => ActionMenuItem;
  };
  /** Props for `GroupChannelListModule.TypeSelector` **/
  TypeSelector: {
    /** Prop from Fragment `Fragment.skipTypeSelection` **/
    skipTypeSelection: boolean;
    /** Method called when type is selected, call `Fragment.onPressCreateChannel` **/
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

export type GroupChannelListFragment = CommonComponent<GroupChannelListProps['Fragment']>;
export type GroupChannelType = 'GROUP' | 'SUPER_GROUP' | 'BROADCAST';
