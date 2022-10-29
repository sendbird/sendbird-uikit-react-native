import React, { createContext } from 'react';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../hooks/useContext';
import type { GroupChannelOperatorsContextsType, GroupChannelOperatorsModule } from '../types';

export const GroupChannelOperatorsContexts: GroupChannelOperatorsContextsType = {
  Fragment: createContext({
    headerTitle: '',
  }),
};

export const GroupChannelOperatorsContextsProvider: GroupChannelOperatorsModule['Provider'] = ({ children }) => {
  const { STRINGS } = useLocalization();
  return (
    <ProviderLayout>
      <GroupChannelOperatorsContexts.Fragment.Provider
        value={{ headerTitle: STRINGS.GROUP_CHANNEL_OPERATORS.HEADER_TITLE }}
      >
        {children}
      </GroupChannelOperatorsContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
