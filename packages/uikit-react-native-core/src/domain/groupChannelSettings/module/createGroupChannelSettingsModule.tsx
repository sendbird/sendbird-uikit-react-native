import GroupChannelSettingsHeader from '../component/GroupChannelSettingsHeader';
import GroupChannelSettingsInfo from '../component/GroupChannelSettingsInfo';
import GroupChannelSettingsMenu from '../component/GroupChannelSettingsMenu';
import type { GroupChannelSettingsModule } from '../types';
import { GroupChannelSettingsContextProvider } from './moduleContext';

const createGroupChannelSettingsModule = ({
  Header = GroupChannelSettingsHeader,
  Info = GroupChannelSettingsInfo,
  Menu = GroupChannelSettingsMenu,
  Provider = GroupChannelSettingsContextProvider,
  ...module
}: Partial<GroupChannelSettingsModule> = {}): GroupChannelSettingsModule => {
  return { Header, Info, Menu, Provider, ...module };
};

export default createGroupChannelSettingsModule;
