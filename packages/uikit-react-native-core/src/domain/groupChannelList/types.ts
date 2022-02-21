import type React from 'react';
import type { FlatListProps } from 'react-native';
import type Sendbird from 'sendbird';

import type { UseGroupChannelListOptions } from '@sendbird/chat-react-hooks';
import type { BaseHeaderProps } from '@sendbird/uikit-react-native-foundation';

import type { CommonComponent } from '../../types';

/** Specific props type for creating header **/
type FragmentHeaderProps = BaseHeaderProps<{ title: string; right: React.ReactElement; onPressRight: () => void }>;
type TypeSelectorHeaderProps = BaseHeaderProps<{ title: string; right: React.ReactElement; onPressRight: () => void }>;
export type GroupChannelListProps = {
  Fragment: {
    Header?: null | CommonComponent<FragmentHeaderProps>;
    TypeSelectorHeader?: null | CommonComponent<TypeSelectorHeaderProps>;
    skipTypeSelection?: boolean;
    onPressChannel: (channel: Sendbird.GroupChannel) => void;
    onPressCreateChannel: (channelType: GroupChannelType) => void;
    queryCreator?: UseGroupChannelListOptions['queryCreator'];
    sortComparator?: UseGroupChannelListOptions['sortComparator'];
    flatListProps?: GroupChannelListProps['List']['flatListProps'];
  };
  Header: {
    Header: GroupChannelListProps['Fragment']['Header'];
  };
  List: {
    groupChannels: Sendbird.GroupChannel[];
    renderGroupChannelPreview: (channel: Sendbird.GroupChannel) => React.ReactElement | null;
    onLoadMore: () => Promise<void>;
    onRefresh?: () => Promise<void>;
    refreshing?: boolean;
    flatListProps?: Omit<FlatListProps<Sendbird.GroupChannel>, 'data' | 'renderItem'>;
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
export type GroupChannelListContextType = {
  fragment: {
    headerTitle: string;
  };
  typeSelector: {
    visible: boolean;
    show: () => void;
    hide: () => void;
    headerTitle: string;
  };
};
export interface GroupChannelListModule {
  Provider: React.FC;
  Header: CommonComponent<GroupChannelListProps['Header']>;
  List: CommonComponent<GroupChannelListProps['List']>;
  TypeSelector: CommonComponent<GroupChannelListProps['TypeSelector']>;
}

export type GroupChannelListFragment = React.FC<GroupChannelListProps['Fragment']>;
export type GroupChannelType = 'GROUP' | 'SUPER_GROUP' | 'BROADCAST';
