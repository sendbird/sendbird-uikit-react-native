import React, { createContext, useState } from 'react';

import { EmptyFunction } from '@sendbird/uikit-utils';

import type { InviteMembersContextType } from '../types';

export const InviteMembersContext = createContext<InviteMembersContextType<unknown>>({
  selectedUsers: [],
  setSelectedUsers: EmptyFunction,
});

export const InviteMembersContextProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [selectedUsers, setSelectedUsers] = useState<unknown[]>([]);

  return (
    <InviteMembersContext.Provider value={{ selectedUsers, setSelectedUsers }}>
      {children}
    </InviteMembersContext.Provider>
  );
};
