import GroupChannelListChannelMenu from '../component/GroupChannelListChannelMenu';
import GroupChannelListHeader from '../component/GroupChannelListHeader';
import GroupChannelListList from '../component/GroupChannelListList';
import GroupChannelListTypeSelector from '../component/GroupChannelListTypeSelector';
import type { GroupChannelListModule } from '../types';
import { GroupChannelListContextProvider } from './moduleContext';

const createGroupChannelListModule = ({
  Header = GroupChannelListHeader,
  List = GroupChannelListList,
  TypeSelector = GroupChannelListTypeSelector,
  ChannelMenu = GroupChannelListChannelMenu,
  Provider = GroupChannelListContextProvider,
  ...module
}: Partial<GroupChannelListModule> = {}): GroupChannelListModule => {
  return { Header, List, TypeSelector, ChannelMenu, Provider, ...module };
};

export default createGroupChannelListModule;
