import UserListHeader from '../component/UserListHeader';
import UserListList from '../component/UserListList';
import type { UserListModule } from '../types';
import { UserListContextProvider } from './moduleContext';

const createUserListModule = <T,>({
  Header = UserListHeader,
  List = UserListList,
  Provider = UserListContextProvider,
  ...module
}: Partial<UserListModule<T>> = {}): UserListModule<T> => {
  return { Header, List, Provider, ...module };
};

export default createUserListModule;
