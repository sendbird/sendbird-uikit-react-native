import React, { createContext, useState } from 'react';

import type { ContextValue } from '@sendbird/uikit-utils';
import { NOOP } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import type { UserListContextsType, UserListProps } from '../types';

export const UserListContexts: UserListContextsType<unknown> = {
  Fragment: createContext({
    headerTitle: '',
    headerRight: '',
  }),
  List: createContext<ContextValue<UserListContextsType<unknown>['List']>>({
    selectedUsers: [],
    setSelectedUsers: NOOP,
  }),
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserListContextsProvider: React.FC<UserListProps<any>['Provider']> = ({
  children,
  headerTitle,
  headerRight,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<unknown[]>([]);

  return (
    <ProviderLayout>
      <UserListContexts.Fragment.Provider value={{ headerTitle, headerRight: headerRight(selectedUsers) }}>
        <UserListContexts.List.Provider value={{ selectedUsers, setSelectedUsers }}>
          {children}
        </UserListContexts.List.Provider>
      </UserListContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
