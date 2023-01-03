import type { UserStruct } from '@sendbird/uikit-utils';

import UserListHeader from '../component/UserListHeader';
import UserListList from '../component/UserListList';
import UserListStatusEmpty from '../component/UserListStatusEmpty';
import UserListStatusError from '../component/UserListStatusError';
import UserListStatusLoading from '../component/UserListStatusLoading';
import type { UserListModule } from '../types';
import { UserListContextsProvider } from './moduleContext';

const createUserListModule = <T extends UserStruct>({
  Header = UserListHeader,
  List = UserListList,
  StatusLoading = UserListStatusLoading,
  StatusEmpty = UserListStatusEmpty,
  StatusError = UserListStatusError,
  Provider = UserListContextsProvider,
  ...module
}: Partial<UserListModule<T>> = {}): UserListModule<T> => {
  return { Header, List, StatusLoading, StatusEmpty, StatusError, Provider, ...module };
};

export default createUserListModule;
