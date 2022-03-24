import GroupChannelHeader from '../component/GroupChannelHeader';
import GroupChannelInput from '../component/GroupChannelInput';
import GroupChannelMessageList from '../component/GroupChannelMessageList';
import type { GroupChannelModule } from '../types';
import { GroupChannelContextProvider } from './moduleContext';

const createGroupChannelModule = ({
  Header = GroupChannelHeader,
  MessageList = GroupChannelMessageList,
  Input = GroupChannelInput,
  Provider = GroupChannelContextProvider,
  ...module
}: Partial<GroupChannelModule> = {}): GroupChannelModule => {
  return { Header, MessageList, Input, Provider, ...module };
};

export default createGroupChannelModule;
