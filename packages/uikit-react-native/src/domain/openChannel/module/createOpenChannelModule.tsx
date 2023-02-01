import OpenChannelHeader from '../component/OpenChannelHeader';
import OpenChannelInput from '../component/OpenChannelInput';
import OpenChannelMessageList from '../component/OpenChannelMessageList';
import OpenChannelStatusEmpty from '../component/OpenChannelStatusEmpty';
import OpenChannelStatusLoading from '../component/OpenChannelStatusLoading';
import type { OpenChannelModule } from '../types';
import { OpenChannelContextsProvider } from './moduleContext';

const createOpenChannelModule = ({
  Header = OpenChannelHeader,
  MessageList = OpenChannelMessageList,
  Input = OpenChannelInput,
  StatusLoading = OpenChannelStatusLoading,
  StatusEmpty = OpenChannelStatusEmpty,
  Provider = OpenChannelContextsProvider,
  ...module
}: Partial<OpenChannelModule> = {}): OpenChannelModule => {
  return { Header, MessageList, Input, Provider, StatusEmpty, StatusLoading, ...module };
};

export default createOpenChannelModule;
