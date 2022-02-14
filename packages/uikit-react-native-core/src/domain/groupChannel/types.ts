import type React from 'react';
import type Sendbird from 'sendbird';

import type { BaseHeaderProps, CommonComponent } from '../../types';

export type GroupChannelListProps = {
  List: {
    groupChannels: Sendbird.GroupChannel[];
    renderGroupChannelPreview: (channel: Sendbird.GroupChannel) => React.ReactElement | null;
    onLoadMore: () => Promise<void>;
    onRefresh?: () => Promise<void>;
    refreshing?: boolean;
  };
  Fragment: {
    Header?: (props: BaseHeaderProps<{ title: string; right: React.ReactElement }>) => null | JSX.Element;
    onPressChannel: (channel: Sendbird.GroupChannel) => void;
    onPressCreateChannel: () => void;
  };
};
export type GroupChannelListContext = {};
export interface GroupChannelListModule {
  Context: React.Context<GroupChannelListContext>;
  Provider: React.FC;
  List: CommonComponent<GroupChannelListProps['List']>;
}

export type GroupChannelListFragment = React.FC<GroupChannelListProps['Fragment']>;
export type GroupChannelListHeaderProps = Pick<GroupChannelListProps['Fragment'], 'Header' | 'onPressCreateChannel'> & {
  Context: GroupChannelListModule['Context'];
};
