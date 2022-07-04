import GroupChannelSettingsHeader from '../component/GroupChannelSettingsHeader';
import GroupChannelSettingsInfo from '../component/GroupChannelSettingsInfo';
import GroupChannelSettingsMenu from '../component/GroupChannelSettingsMenu';
import type { GroupChannelSettingsModule } from '../types';
import { GroupChannelSettingsContextsProvider } from './moduleContext';

const createGroupChannelSettingsModule = ({
  Header = GroupChannelSettingsHeader,
  Info = GroupChannelSettingsInfo,
  Menu = GroupChannelSettingsMenu,
  Provider = GroupChannelSettingsContextsProvider,
  ...module
}: Partial<GroupChannelSettingsModule> = {}): GroupChannelSettingsModule => {
  return { Header, Info, Menu, Provider, ...module };
};

export default createGroupChannelSettingsModule;
