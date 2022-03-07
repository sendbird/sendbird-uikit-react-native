import React, { createContext, useState } from 'react';

import { EmptyFunction } from '@sendbird/uikit-utils';

import { useLocalization } from '../../../contexts/Localization';
import type { InviteMembersContextType } from '../types';

export const InviteMembersContext = createContext<InviteMembersContextType<unknown>>({
  fragment: { headerTitle: '', headerRight: '' },
  selectedUsers: [],
  setSelectedUsers: EmptyFunction,
});

export const InviteMembersContextProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { LABEL } = useLocalization();
  const [selectedUsers, setSelectedUsers] = useState<unknown[]>([]);

  return (
    <InviteMembersContext.Provider
      value={{
        fragment: {
          headerTitle: LABEL.INVITE_MEMBERS.HEADER_TITLE,
          headerRight: LABEL.INVITE_MEMBERS.HEADER_RIGHT({ selectedUsers }),
        },
        selectedUsers,
        setSelectedUsers,
      }}
    >
      {children}
    </InviteMembersContext.Provider>
  );
};
