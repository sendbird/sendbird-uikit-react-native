import React, { createContext, useState } from 'react';

import type { ContextValue } from '@sendbird/uikit-utils';
import { EmptyFunction } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import type { UserListContextType, UserListProps } from '../types';

export const UserListContext: UserListContextType<unknown> = {
  Fragment: createContext({
    headerTitle: '',
    headerRight: '',
  }),
  List: createContext<ContextValue<UserListContextType<unknown>['List']>>({
    selectedUsers: [],
    setSelectedUsers: EmptyFunction,
  }),
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserListContextProvider: React.FC<UserListProps<any>['Provider']> = ({
  children,
  headerTitle,
  headerRight,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<unknown[]>([]);

  return (
    <ProviderLayout>
      <UserListContext.Fragment.Provider value={{ headerTitle, headerRight: headerRight(selectedUsers) }}>
        <UserListContext.List.Provider value={{ selectedUsers, setSelectedUsers }}>
          {children}
        </UserListContext.List.Provider>
      </UserListContext.Fragment.Provider>
    </ProviderLayout>
  );
};
