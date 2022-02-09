import React, { useContext, useState } from 'react';

import type { LabelLocale, LabelSet } from '../localization/label.type';

type Props<T extends string = LabelLocale> = {
  defaultLocale: T;
  labelSet: Record<T, LabelSet>;
};

type Context<T extends string = LabelLocale> = {
  LABEL: LabelSet;
  locale: T;
  setLocale: React.Dispatch<T>;
};

export const LocalizationContext = React.createContext<Context | null>(null);
export const LocalizationProvider: React.FC<Props> = ({ children, labelSet, defaultLocale }) => {
  const [locale, setLocale] = useState(defaultLocale);
  const LABEL = labelSet[locale];
  if (!LABEL) throw new Error(`Invalid Locale(${locale}) or LabelSet(${Object.keys(labelSet).join()})`);
  return <LocalizationContext.Provider value={{ LABEL, locale, setLocale }}>{children}</LocalizationContext.Provider>;
};

export const useLocalization = () => {
  const value = useContext(LocalizationContext);
  if (!value) throw new Error('LocalizationContext is not provided');
  return value;
};
