import InviteMembersList from '../component/InviteMembersList';
import type { InviteMembersModule } from '../types';
import { InviteMembersContextProvider } from './moduleContext';

const createInviteMembersModule = <T,>({
  List = InviteMembersList,
  Provider = InviteMembersContextProvider,
  ...module
}: Partial<InviteMembersModule<T>> = {}): InviteMembersModule<T> => {
  return { List, Provider, ...module };
};

export default createInviteMembersModule;
