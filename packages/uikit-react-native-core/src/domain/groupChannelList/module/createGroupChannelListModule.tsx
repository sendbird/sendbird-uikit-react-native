import GroupChannelListList from '../component/GroupChannelListList';
import GroupChannelListTypeSelector from '../component/GroupChannelListTypeSelector';
import type { GroupChannelListModule } from '../types';
import { GroupChannelListContextProvider } from './moduleContext';

const createGroupChannelListModule = ({
  List = GroupChannelListList,
  TypeSelector = GroupChannelListTypeSelector,
  Provider = GroupChannelListContextProvider,
  ...module
}: Partial<GroupChannelListModule> = {}): GroupChannelListModule => {
  return { List, TypeSelector, Provider, ...module };
};

export default createGroupChannelListModule;
