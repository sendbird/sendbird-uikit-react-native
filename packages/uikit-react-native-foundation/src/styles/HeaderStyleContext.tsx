import React from 'react';
import { StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { BaseHeaderProps, HeaderElement } from '../types';

export type HeaderStyleContextType = {
  HeaderComponent: (
    props: BaseHeaderProps<
      {
        title?: HeaderElement;
        left?: HeaderElement;
        right?: HeaderElement;
        onPressLeft?: () => void;
        onPressRight?: () => void;
      },
      { clearTitleMargin?: boolean }
    >,
  ) => React.ReactElement | null;
  defaultTitleAlign: 'left' | 'center';
  statusBarTranslucent: boolean;
  topInset: number;
};
export const HeaderStyleContext = React.createContext<HeaderStyleContextType>({
  HeaderComponent: () => null,
  defaultTitleAlign: 'left',
  statusBarTranslucent: true,
  topInset: StatusBar.currentHeight ?? 0,
});

type Props = Pick<HeaderStyleContextType, 'statusBarTranslucent' | 'defaultTitleAlign' | 'HeaderComponent'>;
export const HeaderStyleProvider: React.FC<Props> = ({
  children,
  HeaderComponent = () => null,
  defaultTitleAlign,
  statusBarTranslucent,
}) => {
  const { top } = useSafeAreaInsets();

  return (
    <HeaderStyleContext.Provider
      value={{
        HeaderComponent,
        defaultTitleAlign,
        statusBarTranslucent,
        topInset: statusBarTranslucent ? top : 0,
      }}
    >
      {children}
    </HeaderStyleContext.Provider>
  );
};
