import OpenChannelListHeader from '../component/OpenChannelListHeader';
import OpenChannelListList from '../component/OpenChannelListList';
import OpenChannelListStatusEmpty from '../component/OpenChannelListStatusEmpty';
import OpenChannelListStatusLoading from '../component/OpenChannelListStatusLoading';
import type { OpenChannelListModule } from '../types';
import { OpenChannelListContextsProvider } from './moduleContext';

const createOpenChannelListModule = ({
  Header = OpenChannelListHeader,
  List = OpenChannelListList,
  StatusLoading = OpenChannelListStatusLoading,
  StatusEmpty = OpenChannelListStatusEmpty,
  Provider = OpenChannelListContextsProvider,
  ...module
}: Partial<OpenChannelListModule> = {}): OpenChannelListModule => {
  return { Header, List, Provider, StatusEmpty, StatusLoading, ...module };
};

export default createOpenChannelListModule;
