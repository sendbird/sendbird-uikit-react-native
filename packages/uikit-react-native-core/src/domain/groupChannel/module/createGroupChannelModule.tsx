import GroupChannelHeader from '../component/GroupChannelHeader';
import GroupChannelView from '../component/GroupChannelView';
import type { GroupChannelModule } from '../types';
import { GroupChannelContextProvider } from './moduleContext';

const createGroupChannelModule = ({
  Header = GroupChannelHeader,
  View = GroupChannelView,
  Provider = GroupChannelContextProvider,
  ...module
}: Partial<GroupChannelModule> = {}): GroupChannelModule => {
  return { Header, View, Provider, ...module };
};

export default createGroupChannelModule;
