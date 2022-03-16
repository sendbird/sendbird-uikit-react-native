import GroupChannelHeader from '../component/GroupChannelHeader';
import GroupChannelMessageList from '../component/GroupChannelMessageList';
import type { GroupChannelModule } from '../types';
import { GroupChannelContextProvider } from './moduleContext';

const createGroupChannelModule = ({
  Header = GroupChannelHeader,
  View = GroupChannelMessageList,
  Provider = GroupChannelContextProvider,
  ...module
}: Partial<GroupChannelModule> = {}): GroupChannelModule => {
  return { Header, View, Provider, ...module };
};

export default createGroupChannelModule;
