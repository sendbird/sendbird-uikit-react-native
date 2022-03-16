import GroupChannelHeader from '../component/GroupChannelHeader';
import GroupChannelMessageList from '../component/GroupChannelMessageList';
import type { GroupChannelModule } from '../types';
import { GroupChannelContextProvider } from './moduleContext';

const createGroupChannelModule = ({
  Header = GroupChannelHeader,
  MessageList = GroupChannelMessageList,
  Provider = GroupChannelContextProvider,
  ...module
}: Partial<GroupChannelModule> = {}): GroupChannelModule => {
  return { Header, MessageList, Provider, ...module };
};

export default createGroupChannelModule;
