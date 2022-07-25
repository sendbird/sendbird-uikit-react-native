import React from 'react';

import type { StringSet } from '../localization/StringSet.type';

type Props = {
  stringSet: StringSet;
  children?: React.ReactNode;
};

export type LocalizationContextType = {
  STRINGS: StringSet;
};

export const LocalizationContext = React.createContext<LocalizationContextType | null>(null);
export const LocalizationProvider = ({ children, stringSet }: Props) => {
  return <LocalizationContext.Provider value={{ STRINGS: stringSet }}>{children}</LocalizationContext.Provider>;
};
