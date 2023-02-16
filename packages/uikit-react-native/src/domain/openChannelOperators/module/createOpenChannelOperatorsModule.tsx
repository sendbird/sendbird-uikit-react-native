import OpenChannelOperatorsHeader from '../component/OpenChannelOperatorsHeader';
import OpenChannelOperatorsList from '../component/OpenChannelOperatorsList';
import OpenChannelOperatorsStatusEmpty from '../component/OpenChannelOperatorsStatusEmpty';
import OpenChannelOperatorsStatusError from '../component/OpenChannelOperatorsStatusError';
import OpenChannelOperatorsStatusLoading from '../component/OpenChannelOperatorsStatusLoading';
import type { OpenChannelOperatorsModule } from '../types';
import { OpenChannelOperatorsContextsProvider } from './moduleContext';

const createOpenChannelOperatorsModule = ({
  Header = OpenChannelOperatorsHeader,
  List = OpenChannelOperatorsList,
  StatusLoading = OpenChannelOperatorsStatusLoading,
  StatusEmpty = OpenChannelOperatorsStatusEmpty,
  StatusError = OpenChannelOperatorsStatusError,
  Provider = OpenChannelOperatorsContextsProvider,
  ...module
}: Partial<OpenChannelOperatorsModule> = {}): OpenChannelOperatorsModule => {
  return { Header, List, Provider, StatusEmpty, StatusLoading, StatusError, ...module };
};

export default createOpenChannelOperatorsModule;
