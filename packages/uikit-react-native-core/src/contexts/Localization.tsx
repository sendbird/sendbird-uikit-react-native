import React, { useContext, useState } from 'react';

import type { StringsLocale, StringSet } from '../localization/StringSet.type';

type Props<T extends string = StringsLocale['locale']> = {
  defaultLocale: T;
  stringSets: Record<T, StringSet>;
  children?: React.ReactNode;
};

type Context<T extends string = StringsLocale['locale']> = {
  STRINGS: StringSet;
  locale: T;
  setLocale: React.Dispatch<T>;
};

export const LocalizationContext = React.createContext<Context | null>(null);
export const LocalizationProvider = ({ children, stringSets, defaultLocale }: Props) => {
  const [locale, setLocale] = useState(defaultLocale);
  const STRINGS = stringSets[locale];
  if (!STRINGS) throw new Error(`Invalid Locale(${locale}) or StringSet(${Object.keys(stringSets).join()})`);
  return <LocalizationContext.Provider value={{ STRINGS, locale, setLocale }}>{children}</LocalizationContext.Provider>;
};

export const useLocalization = <T extends string = StringsLocale['locale']>() => {
  const value = useContext<Context<T> | null>(LocalizationContext as React.Context<Context<T> | null>);
  if (!value) throw new Error('LocalizationContext is not provided');
  return value;
};
