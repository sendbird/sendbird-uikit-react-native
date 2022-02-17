import type React from 'react';
import type Sendbird from 'sendbird';

import type { UseGroupChannelListOptions } from '@sendbird/chat-react-hooks';

import type { BaseHeaderProps, CommonComponent } from '../../types';

/** Specific props type for creating fragment header **/
type FragmentHeaderProps = BaseHeaderProps<{ title: string; right: React.ReactElement; onPressRight: () => void }>;
type TypeSelectorHeaderProps = BaseHeaderProps<{ title: string; right: React.ReactElement; onPressRight: () => void }>;
export type GroupChannelListProps = {
  List: {
    groupChannels: Sendbird.GroupChannel[];
    renderGroupChannelPreview: (channel: Sendbird.GroupChannel) => React.ReactElement | null;
    onLoadMore: () => Promise<void>;
    onRefresh?: () => Promise<void>;
    refreshing?: boolean;
  };
  TypeSelector: {
    Header: React.FC;
    TypeIcon: CommonComponent<{ type: GroupChannelType }>;
    TypeText: CommonComponent<{ type: GroupChannelType }>;
    skipTypeSelection: boolean;
    statusBarTranslucent: boolean;
    topInset: number;
    onSelectType: (type: GroupChannelType) => void;
  };
  Fragment: {
    FragmentHeader?: null | CommonComponent<FragmentHeaderProps>;
    TypeSelectorHeader?: null | CommonComponent<TypeSelectorHeaderProps>;
    skipTypeSelection?: boolean;
    onPressChannel: (channel: Sendbird.GroupChannel) => void;
    onPressCreateChannel: (channelType: GroupChannelType) => void;
    queryFactory?: UseGroupChannelListOptions['queryFactory'];
    sortComparator?: UseGroupChannelListOptions['sortComparator'];
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
  List: CommonComponent<GroupChannelListProps['List']>;
  TypeSelector: CommonComponent<GroupChannelListProps['TypeSelector']>;
}

export type GroupChannelListFragment = React.FC<GroupChannelListProps['Fragment']>;
export type GroupChannelType = 'GROUP' | 'SUPER_GROUP' | 'BROADCAST';
