import React, { useContext, useState } from 'react';

import type { LabelLocale, LabelSet } from '../localization/label.type';

type Props<T extends string = LabelLocale['locale']> = {
  defaultLocale: T;
  labelSet: Record<T, LabelSet>;
  children?: React.ReactNode;
};

type Context<T extends string = LabelLocale['locale']> = {
  LABEL: LabelSet;
  locale: T;
  setLocale: React.Dispatch<T>;
};

export const LocalizationContext = React.createContext<Context | null>(null);
export const LocalizationProvider = ({ children, labelSet, defaultLocale }: Props) => {
  const [locale, setLocale] = useState(defaultLocale);
  const LABEL = labelSet[locale];
  if (!LABEL) throw new Error(`Invalid Locale(${locale}) or LabelSet(${Object.keys(labelSet).join()})`);
  return <LocalizationContext.Provider value={{ LABEL, locale, setLocale }}>{children}</LocalizationContext.Provider>;
};

export const useLocalization = <T extends string = LabelLocale['locale']>() => {
  const value = useContext<Context<T> | null>(LocalizationContext as React.Context<Context<T> | null>);
  if (!value) throw new Error('LocalizationContext is not provided');
  return value;
};
