import type React from 'react';

export type CommonComponent<P = {}> = (props: P) => React.ReactNode;

export type GroupChannelListProps = {
  Header: {};
  List: {};
  Fragment: {};
};
export interface GroupChannelListModule {
  Header: CommonComponent<GroupChannelListProps['Header']>;
  List: CommonComponent<GroupChannelListProps['List']>;
}
export type GroupChannelListFragment = React.FC<GroupChannelListProps['Fragment']> & GroupChannelListModule;
