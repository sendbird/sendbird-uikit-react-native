import GroupChannelMutedMembersHeader from '../component/GroupChannelMutedMembersHeader';
import GroupChannelMutedMembersList from '../component/GroupChannelMutedMembersList';
import GroupChannelMutedMembersStatusEmpty from '../component/GroupChannelMutedMembersStatusEmpty';
import GroupChannelMutedMembersStatusError from '../component/GroupChannelMutedMembersStatusError';
import GroupChannelMutedMembersStatusLoading from '../component/GroupChannelMutedMembersStatusLoading';
import type { GroupChannelMutedMembersModule } from '../types';
import { GroupChannelMutedMembersContextsProvider } from './moduleContext';

const createGroupChannelMutedMembersModule = ({
  Header = GroupChannelMutedMembersHeader,
  List = GroupChannelMutedMembersList,
  StatusEmpty = GroupChannelMutedMembersStatusEmpty,
  StatusError = GroupChannelMutedMembersStatusError,
  StatusLoading = GroupChannelMutedMembersStatusLoading,
  Provider = GroupChannelMutedMembersContextsProvider,
  ...module
}: Partial<GroupChannelMutedMembersModule> = {}): GroupChannelMutedMembersModule => {
  return { Header, List, Provider, StatusEmpty, StatusError, StatusLoading, ...module };
};

export default createGroupChannelMutedMembersModule;
