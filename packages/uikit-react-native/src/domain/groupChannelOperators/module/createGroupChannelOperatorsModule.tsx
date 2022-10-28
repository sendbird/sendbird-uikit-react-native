import GroupChannelOperatorsHeader from '../component/GroupChannelOperatorsHeader';
import GroupChannelOperatorsList from '../component/GroupChannelOperatorsList';
import GroupChannelOperatorsStatusEmpty from '../component/GroupChannelOperatorsStatusEmpty';
import GroupChannelOperatorsStatusLoading from '../component/GroupChannelOperatorsStatusLoading';
import type { GroupChannelOperatorsModule } from '../types';
import { GroupChannelOperatorsContextsProvider } from './moduleContext';

const createGroupChannelOperatorsModule = ({
  Header = GroupChannelOperatorsHeader,
  List = GroupChannelOperatorsList,
  StatusLoading = GroupChannelOperatorsStatusLoading,
  StatusEmpty = GroupChannelOperatorsStatusEmpty,
  Provider = GroupChannelOperatorsContextsProvider,
  ...module
}: Partial<GroupChannelOperatorsModule> = {}): GroupChannelOperatorsModule => {
  return { Header, List, Provider, StatusEmpty, StatusLoading, ...module };
};

export default createGroupChannelOperatorsModule;
