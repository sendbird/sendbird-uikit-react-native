import OpenChannelModerationHeader from '../component/OpenChannelModerationHeader';
import OpenChannelModerationMenu from '../component/OpenChannelModerationMenu';
import type { OpenChannelModerationModule } from '../types';
import { OpenChannelModerationContextsProvider } from './moduleContext';

const createOpenChannelModerationModule = ({
  Header = OpenChannelModerationHeader,
  Menu = OpenChannelModerationMenu,
  Provider = OpenChannelModerationContextsProvider,
  ...module
}: Partial<OpenChannelModerationModule> = {}): OpenChannelModerationModule => {
  return { Header, Menu, Provider, ...module };
};

export default createOpenChannelModerationModule;
