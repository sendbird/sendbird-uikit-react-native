import React, { createContext } from 'react';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../hooks/useContext';
import type { GroupChannelBannedUsersContextsType, GroupChannelBannedUsersModule } from '../types';

export const GroupChannelBannedUsersContexts: GroupChannelBannedUsersContextsType = {
  Fragment: createContext({
    headerTitle: '',
  }),
};

export const GroupChannelBannedUsersContextsProvider: GroupChannelBannedUsersModule['Provider'] = ({ children }) => {
  const { STRINGS } = useLocalization();
  return (
    <ProviderLayout>
      <GroupChannelBannedUsersContexts.Fragment.Provider
        value={{ headerTitle: STRINGS.GROUP_CHANNEL_BANNED_USERS.HEADER_TITLE }}
      >
        {children}
      </GroupChannelBannedUsersContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
