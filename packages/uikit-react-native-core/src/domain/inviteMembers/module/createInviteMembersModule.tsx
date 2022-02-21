import InviteMembersHeader from '../component/InviteMembersHeader';
import InviteMembersList from '../component/InviteMembersList';
import type { InviteMembersModule } from '../types';
import { InviteMembersContextProvider } from './moduleContext';

const createInviteMembersModule = <T,>({
  Header = InviteMembersHeader,
  List = InviteMembersList,
  Provider = InviteMembersContextProvider,
  ...module
}: Partial<InviteMembersModule<T>> = {}): InviteMembersModule<T> => {
  return { Header, List, Provider, ...module };
};

export default createInviteMembersModule;
