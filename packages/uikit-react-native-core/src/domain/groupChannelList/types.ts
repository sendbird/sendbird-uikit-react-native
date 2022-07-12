import type React from 'react';
import type { FlatListProps } from 'react-native';
import type Sendbird from 'sendbird';

import type { UseGroupChannelListOptions } from '@sendbird/uikit-chat-hooks';
import type { ActionMenuItem, BaseHeaderProps } from '@sendbird/uikit-react-native-foundation';

import type { CommonComponent } from '../../types';

/**
 * @type {GroupChannelListProps.Fragment} - Props from developer to create fragment
 * @property Fragment.Header - Custom Header for Fragment, Only replace header component not a module
 * @property Fragment.TypeSelectorHeader - Custom Header for TypeSelector, Only replace header component not a module
 * @property Fragment.skipTypeSelection - Skip type selection, When this is set to true 'channelType' only receive 'GROUP' type
 * @property Fragment.onPressChannel - Navigate to GroupChannelFragment
 * @property Fragment.onPressCreateChannel - Navigate to GroupChannelCreateFragment
 * @property Fragment.queryCreator - Custom Query creator for channels query
 * @property Fragment.sortComparator - Sort comparator for sort channels
 * @property Fragment.flatListProps - FlatList props
 *
 * @type {GroupChannelListProps.Header} - Props from Fragment for create Header module
 * @property Header.Header - Custom header component from Fragment {@link Fragment.Header}
 *
 * @type {GroupChannelListProps.List} - Props from Fragment for create List module
 * @property List.groupChannels - GroupChannels from SendbirdChat SDK, We are using '@sendbird/uikit-chat-hooks'
 * @property List.renderGroupChannelPreview - Method to render GroupChannel preview
 * @property List.onLoadNext - Method to load more data, called with onEndReached of FlatList
 * @property List.flatListProps - FlatList props from Fragment {@link Fragment.flatListProps}
 * @property List.menuItemCreator - Action menu item creator for onLongPress
 *
 * @type {GroupChannelListProps.TypeSelector} - Props from Fragment for create TypeSelector module
 * @property TypeSelector.Header - Custom header component from Fragment {@link Fragment.TypeSelectorHeader}
 * @property TypeSelector.skipTypeSelection - Prop from Fragment {@link Fragment.skipTypeSelection}
 * @property TypeSelector.onSelectType - Method called when type is selected, call {@link Fragment.onPressCreateChannel}.
 * */
export type GroupChannelListProps = {
  Fragment: {
    onPressChannel: (channel: Sendbird.GroupChannel) => void;
    onPressCreateChannel: (channelType: GroupChannelType) => void;
    Header?: null | CommonComponent<
      BaseHeaderProps<{
        title: string;
        right: React.ReactElement;
        onPressRight: () => void;
      }>
    >;
    TypeSelectorHeader?: null | CommonComponent<
      BaseHeaderProps<{
        title: string;
        right: React.ReactElement;
        onPressRight: () => void;
      }>
    >;
    // skipTypeSelection?: boolean;
    queryCreator?: UseGroupChannelListOptions['queryCreator'];
    sortComparator?: UseGroupChannelListOptions['sortComparator'];
    flatListProps?: GroupChannelListProps['List']['flatListProps'];
    menuItemCreator?: GroupChannelListProps['List']['menuItemCreator'];
  };
  Header: {
    Header: GroupChannelListProps['Fragment']['Header'];
  };
  List: {
    groupChannels: Sendbird.GroupChannel[];
    renderGroupChannelPreview: (
      channel: Sendbird.GroupChannel,
      onLongPressChannel: () => void,
    ) => React.ReactElement | null;
    onLoadNext: () => Promise<void>;
    flatListProps?: Omit<FlatListProps<Sendbird.GroupChannel>, 'data' | 'renderItem'>;
    menuItemCreator?: (defaultMenuItem: ActionMenuItem) => ActionMenuItem;
  };
  TypeSelector: {
    Header: GroupChannelListProps['Fragment']['TypeSelectorHeader'];
    skipTypeSelection: boolean;
    onSelectType: (type: GroupChannelType) => void;
  };
};

/**
 * Internal context for GroupChannelList
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type GroupChannelListContextsType = {
  Fragment: React.Context<{
    headerTitle: string;
  }>;
  TypeSelector: React.Context<{
    visible: boolean;
    show: () => void;
    hide: () => void;
    headerTitle: string;
  }>;
};
export interface GroupChannelListModule {
  Provider: React.FC;
  Header: CommonComponent<GroupChannelListProps['Header']>;
  List: CommonComponent<GroupChannelListProps['List']>;
  TypeSelector: CommonComponent<GroupChannelListProps['TypeSelector']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
}

export type GroupChannelListFragment = React.FC<GroupChannelListProps['Fragment']>;
export type GroupChannelType = 'GROUP' | 'SUPER_GROUP' | 'BROADCAST';
