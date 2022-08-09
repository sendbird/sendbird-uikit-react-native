// @ts-nocheck - !!REMOVE
import React, { createContext } from 'react';

import ProviderLayout from '../../../components/ProviderLayout';
import type { __domain__ContextsType, __domain__Module } from '../types';

export const __domain__Contexts: __domain__ContextsType = {
  Fragment: createContext({
    headerTitle: '',
  }),
};

export const __domain__ContextsProvider: __domain__Module['Provider'] = ({ children }) => {
  // const [visible, setVisible] = useState(false);

  return (
    <ProviderLayout>
      <__domain__Contexts.Fragment.Provider value={{ headerTitle: 'STRINGS.DOMAIN.HEADER_TITLE' }}>
        {children}
      </__domain__Contexts.Fragment.Provider>
    </ProviderLayout>
  );
};
