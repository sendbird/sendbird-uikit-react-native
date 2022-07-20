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
  StatusLoading = GroupChannelListStatusLoading,
  StatusEmpty = GroupChannelListStatusEmpty,
  Provider = GroupChannelListContextsProvider,
  ...module
}: Partial<GroupChannelListModule> = {}): GroupChannelListModule => {
  return { Header, List, TypeSelector, StatusLoading, StatusEmpty, Provider, ...module };
};

export default createGroupChannelListModule;
