import React, { createContext, useState } from 'react';

import __domain__View from '../component/__domain__View';
import type { __domain__Context, __domain__Module } from '../types';

export const DomainContext = createContext<__domain__Context>({});
const DomainProvider: React.FC = ({ children }) => {
  const [state] = useState<{}>({});
  return <DomainContext.Provider value={state}>{children}</DomainContext.Provider>;
};

const create__domain__Module = ({
  View = __domain__View,
  Provider = DomainProvider,
  Context = DomainContext,
  ...module
}: Partial<__domain__Module> = {}): __domain__Module => {
  return { View, Provider, Context, ...module };
};

export default create__domain__Module;
