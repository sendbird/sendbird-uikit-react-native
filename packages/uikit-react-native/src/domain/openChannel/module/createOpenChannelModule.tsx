import OpenChannelHeader from '../component/OpenChannelHeader';
import OpenChannelStatusEmpty from '../component/OpenChannelStatusEmpty';
import OpenChannelStatusLoading from '../component/OpenChannelStatusLoading';
import OpenChannelView from '../component/OpenChannelView';
import type { OpenChannelModule } from '../types';
import { OpenChannelContextsProvider } from './moduleContext';

const createOpenChannelModule = ({
  Header = OpenChannelHeader,
  View = OpenChannelView,
  StatusLoading = OpenChannelStatusLoading,
  StatusEmpty = OpenChannelStatusEmpty,
  Provider = OpenChannelContextsProvider,
  ...module
}: Partial<OpenChannelModule> = {}): OpenChannelModule => {
  return { Header, View, Provider, StatusEmpty, StatusLoading, ...module };
};

export default createOpenChannelModule;
