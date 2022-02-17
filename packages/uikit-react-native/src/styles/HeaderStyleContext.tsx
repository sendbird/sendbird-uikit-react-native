import React from 'react';
import { StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ContextType = { statusBarTranslucent: boolean; topInset: number };
export const HeaderStyleContext = React.createContext<ContextType>({
  statusBarTranslucent: true,
  topInset: StatusBar.currentHeight ?? 0,
});

type Props = Pick<ContextType, 'statusBarTranslucent'>;
export const HeaderStyleProvider: React.FC<Props> = ({ children, statusBarTranslucent }) => {
  const { top } = useSafeAreaInsets();

  return (
    <HeaderStyleContext.Provider value={{ statusBarTranslucent, topInset: statusBarTranslucent ? top : 0 }}>
      {children}
    </HeaderStyleContext.Provider>
  );
};
