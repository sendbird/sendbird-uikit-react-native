import GroupChannelSettingsHeader from '../component/GroupChannelSettingsHeader';
import GroupChannelSettingsView from '../component/GroupChannelSettingsView';
import type { GroupChannelSettingsModule } from '../types';
import { GroupChannelSettingsContextProvider } from './moduleContext';

const createGroupChannelSettingsModule = ({
  Header = GroupChannelSettingsHeader,
  View = GroupChannelSettingsView,
  Provider = GroupChannelSettingsContextProvider,
  ...module
}: Partial<GroupChannelSettingsModule> = {}): GroupChannelSettingsModule => {
  return { Header, View, Provider, ...module };
};

export default createGroupChannelSettingsModule;
