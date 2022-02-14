import React, { createContext, useState } from 'react';

import GroupChannelListList from '../component/GroupChannelListList';
import type { GroupChannelListContext, GroupChannelListModule } from '../types';

const DomainContext = createContext<GroupChannelListContext>({});

const GroupChannelListModuleProvider: React.FC = ({ children }) => {
  const [state] = useState<{}>({});
  return <DomainContext.Provider value={state}>{children}</DomainContext.Provider>;
};

const createGroupChannelListModule = ({
  List = GroupChannelListList,
  Provider = GroupChannelListModuleProvider,
  Context = DomainContext,
  ...module
}: Partial<GroupChannelListModule> = {}): GroupChannelListModule => {
  return { List, Provider, Context, ...module };
};

export default createGroupChannelListModule;
