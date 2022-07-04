import GroupChannelHeader from '../component/GroupChannelHeader';
import GroupChannelInput from '../component/GroupChannelInput';
import GroupChannelMessageList from '../component/GroupChannelMessageList';
import type { GroupChannelModule } from '../types';
import { GroupChannelContextsProvider } from './moduleContext';

const createGroupChannelModule = ({
  Header = GroupChannelHeader,
  MessageList = GroupChannelMessageList,
  Input = GroupChannelInput,
  Provider = GroupChannelContextsProvider,
  ...module
}: Partial<GroupChannelModule> = {}): GroupChannelModule => {
  return { Header, MessageList, Input, Provider, ...module };
};

export default createGroupChannelModule;
