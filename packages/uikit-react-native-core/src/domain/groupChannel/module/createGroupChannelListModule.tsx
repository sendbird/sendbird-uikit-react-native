import GroupChannelListHeader from '../component/GroupChannelListHeader';
import GroupChannelListList from '../component/GroupChannelListList';
import type { GroupChannelListModule } from '../types';

const createGroupChannelListModule = (module?: Partial<GroupChannelListModule>): GroupChannelListModule => {
  const { Header = GroupChannelListHeader, List = GroupChannelListList } = module ?? {};
  return { ...module, Header, List };
};

export default createGroupChannelListModule;
