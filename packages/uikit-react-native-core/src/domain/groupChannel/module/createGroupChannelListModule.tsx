import React, { createContext } from 'react';

import { useLocalization } from '../../../contexts/Localization';
import GroupChannelListList from '../component/GroupChannelListList';
import type { GroupChannelListContext, GroupChannelListModule } from '../types';

const DomainContext = createContext<GroupChannelListContext>({ header: { title: '' } });
const DomainProvider: React.FC = ({ children }) => {
  const { LABEL } = useLocalization();
  return (
    <DomainContext.Provider value={{ header: { title: LABEL.GROUP_CHANNEL.LIST.HEADER_TITLE } }}>
      {children}
    </DomainContext.Provider>
  );
};

const createGroupChannelListModule = ({
  List = GroupChannelListList,
  Provider = DomainProvider,
  Context = DomainContext,
  ...module
}: Partial<GroupChannelListModule> = {}): GroupChannelListModule => {
  return { List, Provider, Context, ...module };
};

export default createGroupChannelListModule;
