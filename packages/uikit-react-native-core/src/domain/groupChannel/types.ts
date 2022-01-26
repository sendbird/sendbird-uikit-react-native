import type React from 'react';

import type { BaseHeaderProps, CommonComponent, DomainFragmentProps } from '../../types';

export type GroupChannelListProps = {
  Header: BaseHeaderProps;
  List: {};
  Fragment: DomainFragmentProps<GroupChannelListProps>;
};

export interface GroupChannelListModule {
  Header: CommonComponent<GroupChannelListProps['Header']>;
  List: CommonComponent<GroupChannelListProps['List']>;
}

export type GroupChannelListFragment = React.FC<GroupChannelListProps['Fragment']> & GroupChannelListModule;
