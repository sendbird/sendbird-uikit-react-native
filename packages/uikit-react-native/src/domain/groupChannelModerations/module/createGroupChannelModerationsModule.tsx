import GroupChannelModerationsHeader from '../component/GroupChannelModerationsHeader';
import GroupChannelModerationsMenu from '../component/GroupChannelModerationsMenu';
import type { GroupChannelModerationsModule } from '../types';
import { GroupChannelModerationsContextsProvider } from './moduleContext';

const createGroupChannelModerationsModule = ({
  Header = GroupChannelModerationsHeader,
  Menu = GroupChannelModerationsMenu,
  Provider = GroupChannelModerationsContextsProvider,
  ...module
}: Partial<GroupChannelModerationsModule> = {}): GroupChannelModerationsModule => {
  return { Header, Menu, Provider, ...module };
};

export default createGroupChannelModerationsModule;
