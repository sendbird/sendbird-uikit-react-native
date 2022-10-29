import React, { createContext } from 'react';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../hooks/useContext';
import type { GroupChannelMutedMembersContextsType, GroupChannelMutedMembersModule } from '../types';

export const GroupChannelMutedMembersContexts: GroupChannelMutedMembersContextsType = {
  Fragment: createContext({
    headerTitle: '',
  }),
};

export const GroupChannelMutedMembersContextsProvider: GroupChannelMutedMembersModule['Provider'] = ({ children }) => {
  const { STRINGS } = useLocalization();
  return (
    <ProviderLayout>
      <GroupChannelMutedMembersContexts.Fragment.Provider
        value={{ headerTitle: STRINGS.GROUP_CHANNEL_MUTED_MEMBERS.HEADER_TITLE }}
      >
        {children}
      </GroupChannelMutedMembersContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
