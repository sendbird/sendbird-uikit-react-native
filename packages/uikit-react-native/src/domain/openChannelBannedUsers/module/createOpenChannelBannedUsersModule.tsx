import OpenChannelBannedUsersHeader from '../component/OpenChannelBannedUsersHeader';
import OpenChannelBannedUsersList from '../component/OpenChannelBannedUsersList';
import OpenChannelBannedUsersStatusEmpty from '../component/OpenChannelBannedUsersStatusEmpty';
import OpenChannelBannedUsersStatusError from '../component/OpenChannelBannedUsersStatusError';
import OpenChannelBannedUsersStatusLoading from '../component/OpenChannelBannedUsersStatusLoading';
import type { OpenChannelBannedUsersModule } from '../types';
import { OpenChannelBannedUsersContextsProvider } from './moduleContext';

const createOpenChannelBannedUsersModule = ({
  Header = OpenChannelBannedUsersHeader,
  List = OpenChannelBannedUsersList,
  StatusLoading = OpenChannelBannedUsersStatusLoading,
  StatusEmpty = OpenChannelBannedUsersStatusEmpty,
  StatusError = OpenChannelBannedUsersStatusError,
  Provider = OpenChannelBannedUsersContextsProvider,
  ...module
}: Partial<OpenChannelBannedUsersModule> = {}): OpenChannelBannedUsersModule => {
  return { Header, List, Provider, StatusEmpty, StatusLoading, StatusError, ...module };
};

export default createOpenChannelBannedUsersModule;
