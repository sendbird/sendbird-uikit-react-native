import OpenChannelCreateHeader from '../component/OpenChannelCreateHeader';
import OpenChannelCreateProfileInput from '../component/OpenChannelCreateProfileInput';
import type { OpenChannelCreateModule } from '../types';
import { OpenChannelCreateContextsProvider } from './moduleContext';

const createOpenChannelCreateModule = ({
  Header = OpenChannelCreateHeader,
  ProfileInput = OpenChannelCreateProfileInput,
  Provider = OpenChannelCreateContextsProvider,
  ...module
}: Partial<OpenChannelCreateModule> = {}): OpenChannelCreateModule => {
  return { Header, ProfileInput, Provider, ...module };
};

export default createOpenChannelCreateModule;
