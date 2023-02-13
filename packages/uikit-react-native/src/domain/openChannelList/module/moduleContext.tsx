import React, { createContext } from 'react';

import ProviderLayout from '../../../components/ProviderLayout';
import { useLocalization } from '../../../hooks/useContext';
import type { OpenChannelListContextsType, OpenChannelListModule } from '../types';

export const OpenChannelListContexts: OpenChannelListContextsType = {
  Fragment: createContext({
    headerTitle: '',
  }),
};

export const OpenChannelListContextsProvider: OpenChannelListModule['Provider'] = ({ children }) => {
  const { STRINGS } = useLocalization();
  return (
    <ProviderLayout>
      <OpenChannelListContexts.Fragment.Provider value={{ headerTitle: STRINGS.OPEN_CHANNEL_LIST.HEADER_TITLE }}>
        {children}
      </OpenChannelListContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
