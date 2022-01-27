import React, { useContext, useState } from 'react';

import type { LanguageLocale, LanguageSet } from '../language/language.type';

type Props<T extends string = LanguageLocale> = {
  defaultLocale: T;
  languageSet: Record<T, LanguageSet>;
};

type Context<T extends string = LanguageLocale> = {
  LANG: LanguageSet;
  locale: T;
  setLocale: React.Dispatch<T>;
};

export const LanguageContext = React.createContext<Context | null>(null);
export const LanguageProvider: React.FC<Props> = ({ children, languageSet, defaultLocale }) => {
  const [locale, setLocale] = useState(defaultLocale);
  const LANG = languageSet[locale];
  if (!LANG) throw new Error(`Invalid Locale(${locale}) or StringSet(${Object.keys(languageSet).join()})`);
  return <LanguageContext.Provider value={{ LANG, locale, setLocale }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('LanguageContext is not provided');
  return value;
};
