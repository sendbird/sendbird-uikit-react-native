import React from 'react';

type ContextType = { statusBarTranslucent: boolean };
export const HeaderStyleContext = React.createContext<ContextType>({ statusBarTranslucent: true });

export const HeaderStyleProvider: React.FC<ContextType> = ({ children, statusBarTranslucent }) => {
  // const {} = useSafeAreaContext();
  // const {} = useHea
  return <HeaderStyleContext.Provider value={{ statusBarTranslucent }}>{children}</HeaderStyleContext.Provider>;
};
