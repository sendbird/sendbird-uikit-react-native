import React, { createContext } from 'react';

import ProviderLayout from '../../../components/ProviderLayout';
import type { MessageSearchContextsType, MessageSearchModule } from '../types';

export const MessageSearchContexts: MessageSearchContextsType = {
  Fragment: createContext(null),
};

export const MessageSearchContextsProvider: MessageSearchModule['Provider'] = ({ children }) => {
  return (
    <ProviderLayout>
      <MessageSearchContexts.Fragment.Provider value={null}>{children}</MessageSearchContexts.Fragment.Provider>
    </ProviderLayout>
  );
};
