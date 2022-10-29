import GroupChannelBannedUsersHeader from '../component/GroupChannelBannedUsersHeader';
import GroupChannelBannedUsersList from '../component/GroupChannelBannedUsersList';
import GroupChannelBannedUsersStatusEmpty from '../component/GroupChannelBannedUsersStatusEmpty';
import GroupChannelBannedUsersStatusError from '../component/GroupChannelBannedUsersStatusError';
import GroupChannelBannedUsersStatusLoading from '../component/GroupChannelBannedUsersStatusLoading';
import type { GroupChannelBannedUsersModule } from '../types';
import { GroupChannelBannedUsersContextsProvider } from './moduleContext';

const createGroupChannelBannedUsersModule = ({
  Header = GroupChannelBannedUsersHeader,
  List = GroupChannelBannedUsersList,
  StatusLoading = GroupChannelBannedUsersStatusLoading,
  StatusEmpty = GroupChannelBannedUsersStatusEmpty,
  StatusError = GroupChannelBannedUsersStatusError,
  Provider = GroupChannelBannedUsersContextsProvider,
  ...module
}: Partial<GroupChannelBannedUsersModule> = {}): GroupChannelBannedUsersModule => {
  return { Header, List, Provider, StatusEmpty, StatusLoading, StatusError, ...module };
};

export default createGroupChannelBannedUsersModule;
