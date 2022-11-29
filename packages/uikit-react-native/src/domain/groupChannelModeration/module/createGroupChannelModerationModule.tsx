import GroupChannelModerationHeader from '../component/GroupChannelModerationHeader';
import GroupChannelModerationMenu from '../component/GroupChannelModerationMenu';
import type { GroupChannelModerationModule } from '../types';
import { GroupChannelModerationContextsProvider } from './moduleContext';

const createGroupChannelModerationModule = ({
  Header = GroupChannelModerationHeader,
  Menu = GroupChannelModerationMenu,
  Provider = GroupChannelModerationContextsProvider,
  ...module
}: Partial<GroupChannelModerationModule> = {}): GroupChannelModerationModule => {
  return { Header, Menu, Provider, ...module };
};

export default createGroupChannelModerationModule;
