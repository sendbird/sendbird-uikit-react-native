import type React from 'react';
import type Sendbird from 'sendbird';

import type { BaseHeaderProps, CommonComponent } from '../../types';

type FragmentHeaderProps = BaseHeaderProps<{ title: string; right: React.ReactElement; onPressRight: () => void }>;
export type GroupChannelListProps = {
  List: {
    groupChannels: Sendbird.GroupChannel[];
    renderGroupChannelPreview: (channel: Sendbird.GroupChannel) => React.ReactElement | null;
    onLoadMore: () => Promise<void>;
    onRefresh?: () => Promise<void>;
    refreshing?: boolean;
  };
  Fragment: {
    Header?: null | ((props: FragmentHeaderProps) => null | JSX.Element);
    onPressChannel: (channel: Sendbird.GroupChannel) => void;
    onPressCreateChannel: () => void;
  };
};
export type GroupChannelListContext = {
  header: { title: string };
};
export interface GroupChannelListModule {
  Context: React.Context<GroupChannelListContext>;
  Provider: React.FC;
  List: CommonComponent<GroupChannelListProps['List']>;
}

export type GroupChannelListFragment = React.FC<GroupChannelListProps['Fragment']>;
export type GroupChannelListHeaderProps = Pick<GroupChannelListProps['Fragment'], 'Header' | 'onPressCreateChannel'> & {
  Context: GroupChannelListModule['Context'];
};
