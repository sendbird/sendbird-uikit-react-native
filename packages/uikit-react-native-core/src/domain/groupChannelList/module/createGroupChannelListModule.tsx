import GroupChannelListChannelMenu from '../component/GroupChannelListChannelMenu';
import GroupChannelListHeader from '../component/GroupChannelListHeader';
import GroupChannelListList from '../component/GroupChannelListList';
import GroupChannelListStatusEmpty from '../component/GroupChannelListStatusEmpty';
import GroupChannelListStatusLoading from '../component/GroupChannelListStatusLoading';
import GroupChannelListTypeSelector from '../component/GroupChannelListTypeSelector';
import type { GroupChannelListModule } from '../types';
import { GroupChannelListContextsProvider } from './moduleContext';

const createGroupChannelListModule = ({
  Header = GroupChannelListHeader,
  List = GroupChannelListList,
  TypeSelector = GroupChannelListTypeSelector,
  ChannelMenu = GroupChannelListChannelMenu,
  StatusLoading = GroupChannelListStatusLoading,
  StatusEmpty = GroupChannelListStatusEmpty,
  Provider = GroupChannelListContextsProvider,
  ...module
}: Partial<GroupChannelListModule> = {}): GroupChannelListModule => {
  return { Header, List, TypeSelector, ChannelMenu, StatusLoading, StatusEmpty, Provider, ...module };
};

export default createGroupChannelListModule;
