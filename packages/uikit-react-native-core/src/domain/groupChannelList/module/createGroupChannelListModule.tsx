import GroupChannelListHeader from '../component/GroupChannelListHeader';
import GroupChannelListList from '../component/GroupChannelListList';
import GroupChannelListTypeSelector from '../component/GroupChannelListTypeSelector';
import type { GroupChannelListModule } from '../types';
import { GroupChannelListContextProvider } from './moduleContext';

const createGroupChannelListModule = ({
  Header = GroupChannelListHeader,
  List = GroupChannelListList,
  TypeSelector = GroupChannelListTypeSelector,
  Provider = GroupChannelListContextProvider,
  ...module
}: Partial<GroupChannelListModule> = {}): GroupChannelListModule => {
  return { Header, List, TypeSelector, Provider, ...module };
};

export default createGroupChannelListModule;
