import GroupChannelMutedMembersHeader from '../component/GroupChannelMutedMembersHeader';
import GroupChannelMutedMembersList from '../component/GroupChannelMutedMembersList';
import GroupChannelMutedMembersStatusEmpty from '../component/GroupChannelMutedMembersStatusEmpty';
import type { GroupChannelMutedMembersModule } from '../types';
import { GroupChannelMutedMembersContextsProvider } from './moduleContext';

const createGroupChannelMutedMembersModule = ({
  Header = GroupChannelMutedMembersHeader,
  List = GroupChannelMutedMembersList,
  StatusEmpty = GroupChannelMutedMembersStatusEmpty,
  Provider = GroupChannelMutedMembersContextsProvider,
  ...module
}: Partial<GroupChannelMutedMembersModule> = {}): GroupChannelMutedMembersModule => {
  return { Header, List, Provider, StatusEmpty, ...module };
};

export default createGroupChannelMutedMembersModule;
