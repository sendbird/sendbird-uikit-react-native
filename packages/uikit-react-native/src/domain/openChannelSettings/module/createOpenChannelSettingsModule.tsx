import OpenChannelSettingsHeader from '../component/OpenChannelSettingsHeader';
import OpenChannelSettingsInfo from '../component/OpenChannelSettingsInfo';
import OpenChannelSettingsMenu from '../component/OpenChannelSettingsMenu';
import type { OpenChannelSettingsModule } from '../types';
import { OpenChannelSettingsContextsProvider } from './moduleContext';

const createOpenChannelSettingsModule = ({
  Header = OpenChannelSettingsHeader,
  Info = OpenChannelSettingsInfo,
  Menu = OpenChannelSettingsMenu,
  Provider = OpenChannelSettingsContextsProvider,
  ...module
}: Partial<OpenChannelSettingsModule> = {}): OpenChannelSettingsModule => {
  return { Header, Info, Menu, Provider, ...module };
};

export default createOpenChannelSettingsModule;
