import OpenChannelCreateHeader from '../component/OpenChannelCreateHeader';
import OpenChannelCreateProfileInput from '../component/OpenChannelCreateProfileInput';
import OpenChannelCreateStatusLoading from '../component/OpenChannelCreateStatusLoading';
import type { OpenChannelCreateModule } from '../types';
import { OpenChannelCreateContextsProvider } from './moduleContext';

const createOpenChannelCreateModule = ({
  Header = OpenChannelCreateHeader,
  ProfileInput = OpenChannelCreateProfileInput,
  Provider = OpenChannelCreateContextsProvider,
  StatusLoading = OpenChannelCreateStatusLoading,
  ...module
}: Partial<OpenChannelCreateModule> = {}): OpenChannelCreateModule => {
  return { Header, ProfileInput, Provider, StatusLoading, ...module };
};

export default createOpenChannelCreateModule;
