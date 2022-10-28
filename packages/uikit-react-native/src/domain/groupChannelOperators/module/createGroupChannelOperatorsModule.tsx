import GroupChannelOperatorsHeader from '../component/GroupChannelOperatorsHeader';
import GroupChannelOperatorsList from '../component/GroupChannelOperatorsList';
import GroupChannelOperatorsStatusEmpty from '../component/GroupChannelOperatorsStatusEmpty';
import type { GroupChannelOperatorsModule } from '../types';
import { GroupChannelOperatorsContextsProvider } from './moduleContext';

const createGroupChannelOperatorsModule = ({
  Header = GroupChannelOperatorsHeader,
  List = GroupChannelOperatorsList,
  StatusEmpty = GroupChannelOperatorsStatusEmpty,
  Provider = GroupChannelOperatorsContextsProvider,
  ...module
}: Partial<GroupChannelOperatorsModule> = {}): GroupChannelOperatorsModule => {
  return { Header, List, Provider, StatusEmpty, ...module };
};

export default createGroupChannelOperatorsModule;
