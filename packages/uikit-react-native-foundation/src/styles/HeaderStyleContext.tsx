import React from 'react';
import { StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ContextType = { defaultTitleAlign: 'left' | 'center' | 'right'; statusBarTranslucent: boolean; topInset: number };
export const HeaderStyleContext = React.createContext<ContextType>({
  defaultTitleAlign: 'left',
  statusBarTranslucent: true,
  topInset: StatusBar.currentHeight ?? 0,
});

type Props = Pick<ContextType, 'statusBarTranslucent' | 'defaultTitleAlign'>;
export const HeaderStyleProvider: React.FC<Props> = ({ children, defaultTitleAlign, statusBarTranslucent }) => {
  const { top } = useSafeAreaInsets();

  return (
    <HeaderStyleContext.Provider
      value={{ defaultTitleAlign, statusBarTranslucent, topInset: statusBarTranslucent ? top : 0 }}
    >
      {children}
    </HeaderStyleContext.Provider>
  );
};
