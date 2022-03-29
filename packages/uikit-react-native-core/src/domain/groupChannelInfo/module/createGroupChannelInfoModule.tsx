import GroupChannelInfoHeader from '../component/GroupChannelInfoHeader';
import GroupChannelInfoView from '../component/GroupChannelInfoView';
import type { GroupChannelInfoModule } from '../types';
import { GroupChannelInfoContextProvider } from './moduleContext';

const createGroupChannelInfoModule = ({
  Header = GroupChannelInfoHeader,
  View = GroupChannelInfoView,
  Provider = GroupChannelInfoContextProvider,
  ...module
}: Partial<GroupChannelInfoModule> = {}): GroupChannelInfoModule => {
  return { Header, View, Provider, ...module };
};

export default createGroupChannelInfoModule;
