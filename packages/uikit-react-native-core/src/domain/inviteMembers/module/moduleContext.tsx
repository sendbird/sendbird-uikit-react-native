import React, { createContext, useState } from 'react';

import type { ContextValue } from '@sendbird/uikit-utils';
import { EmptyFunction } from '@sendbird/uikit-utils';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../contexts/Localization';
import type { InviteMembersContextType } from '../types';

export const InviteMembersContext: InviteMembersContextType<unknown> = {
  Fragment: createContext({
    headerTitle: '',
    headerRight: '',
  }),
  List: createContext<ContextValue<InviteMembersContextType<unknown>['List']>>({
    selectedUsers: [],
    setSelectedUsers: EmptyFunction,
  }),
};

export const InviteMembersContextProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { LABEL } = useLocalization();
  const [selectedUsers, setSelectedUsers] = useState<unknown[]>([]);

  return (
    <ProviderLayout>
      <InviteMembersContext.Fragment.Provider
        value={{
          headerTitle: LABEL.INVITE_MEMBERS.HEADER_TITLE,
          headerRight: LABEL.INVITE_MEMBERS.HEADER_RIGHT({ selectedUsers }),
        }}
      >
        <InviteMembersContext.List.Provider value={{ selectedUsers, setSelectedUsers }}>
          {children}
        </InviteMembersContext.List.Provider>
      </InviteMembersContext.Fragment.Provider>
    </ProviderLayout>
  );
};
