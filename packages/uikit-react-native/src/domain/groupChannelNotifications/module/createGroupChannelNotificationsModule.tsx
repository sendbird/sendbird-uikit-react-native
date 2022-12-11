import GroupChannelNotificationsHeader from '../component/GroupChannelNotificationsHeader';
import GroupChannelNotificationsView from '../component/GroupChannelNotificationsView';
import type { GroupChannelNotificationsModule } from '../types';
import { GroupChannelNotificationsContextsProvider } from './moduleContext';

const createGroupChannelNotificationsModule = ({
  Header = GroupChannelNotificationsHeader,
  View = GroupChannelNotificationsView,
  Provider = GroupChannelNotificationsContextsProvider,
  ...module
}: Partial<GroupChannelNotificationsModule> = {}): GroupChannelNotificationsModule => {
  return { Header, View, Provider, ...module };
};

export default createGroupChannelNotificationsModule;
