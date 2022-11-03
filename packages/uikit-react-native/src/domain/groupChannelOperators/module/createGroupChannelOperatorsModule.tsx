import GroupChannelOperatorsHeader from '../component/GroupChannelOperatorsHeader';
import GroupChannelOperatorsList from '../component/GroupChannelOperatorsList';
import GroupChannelOperatorsStatusEmpty from '../component/GroupChannelOperatorsStatusEmpty';
import GroupChannelOperatorsStatusError from '../component/GroupChannelOperatorsStatusError';
import GroupChannelOperatorsStatusLoading from '../component/GroupChannelOperatorsStatusLoading';
import type { GroupChannelOperatorsModule } from '../types';
import { GroupChannelOperatorsContextsProvider } from './moduleContext';

const createGroupChannelOperatorsModule = ({
  Header = GroupChannelOperatorsHeader,
  List = GroupChannelOperatorsList,
  StatusEmpty = GroupChannelOperatorsStatusEmpty,
  StatusError = GroupChannelOperatorsStatusError,
  StatusLoading = GroupChannelOperatorsStatusLoading,
  Provider = GroupChannelOperatorsContextsProvider,
  ...module
}: Partial<GroupChannelOperatorsModule> = {}): GroupChannelOperatorsModule => {
  return { Header, List, Provider, StatusEmpty, StatusError, StatusLoading, ...module };
};

export default createGroupChannelOperatorsModule;
