import React, { createContext } from 'react';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../hooks/useContext';
import type { OpenChannelCreateContextsType, OpenChannelCreateModule } from '../types';

export const OpenChannelCreateContexts: OpenChannelCreateContextsType = {
  Fragment: createContext({
    headerTitle: '',
    headerRight: '',
  }),
};

export const OpenChannelCreateContextsProvider: OpenChannelCreateModule['Provider'] = ({ children }) => {
  const { STRINGS } = useLocalization();
  return (
    <ProviderLayout>
      <OpenChannelCreateContexts.Fragment.Provider
        value={{
          headerTitle: STRINGS.OPEN_CHANNEL_CREATE.HEADER_TITLE,
          headerRight: STRINGS.OPEN_CHANNEL_CREATE.HEADER_RIGHT,
        }}
      >
        {children}
      </OpenChannelCreateContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
