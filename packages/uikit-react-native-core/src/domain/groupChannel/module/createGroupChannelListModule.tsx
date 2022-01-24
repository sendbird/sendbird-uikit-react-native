import type { GroupChannelListModule } from '../../../types';
import GroupChannelListHeader from '../component/GroupChannelListHeader';
import GroupChannelListList from '../component/GroupChannelListList';

const createGroupChannelListModule = (module?: Partial<GroupChannelListModule>): GroupChannelListModule => {
  const { Header = GroupChannelListHeader, List = GroupChannelListList } = module ?? {};
  return { ...module, Header, List };
};

export default createGroupChannelListModule;
