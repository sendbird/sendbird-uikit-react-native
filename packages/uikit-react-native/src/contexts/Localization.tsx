import React, { useState } from 'react';

import type { StringSet, StringsLocale } from '../localization/StringSet.type';

type Props<T extends string = StringsLocale['locale']> = {
  defaultLocale: T;
  stringSets: Record<T, StringSet>;
  children?: React.ReactNode;
};

export type LocalizationContextType<T extends string = StringsLocale['locale']> = {
  STRINGS: StringSet;
  locale: T;
  setLocale: React.Dispatch<T>;
};

export const LocalizationContext = React.createContext<LocalizationContextType | null>(null);
export const LocalizationProvider = ({ children, stringSets, defaultLocale }: Props) => {
  const [locale, setLocale] = useState(defaultLocale);
  const STRINGS = stringSets[locale];
  if (!STRINGS) throw new Error(`Invalid Locale(${locale}) or StringSet(${Object.keys(stringSets).join()})`);
  return <LocalizationContext.Provider value={{ STRINGS, locale, setLocale }}>{children}</LocalizationContext.Provider>;
};
