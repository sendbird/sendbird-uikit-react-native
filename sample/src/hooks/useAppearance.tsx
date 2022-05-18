import React, { createContext, useContext, useState } from 'react';
import { Appearance } from 'react-native';

import { NOOP } from '@sendbird/uikit-utils';

const DEFAULT_APPEARANCE = 'light';

const AppearanceContext = createContext<{ scheme: 'light' | 'dark'; setScheme: (val: 'light' | 'dark') => void }>({
  scheme: DEFAULT_APPEARANCE,
  setScheme: NOOP,
});

export const AppearanceProvider: React.FC<{}> = ({ children }) => {
  const [scheme, setScheme] = useState<'light' | 'dark'>(Appearance.getColorScheme() ?? DEFAULT_APPEARANCE);

  // useEffect(() => {
  //   const unsubscribe = Appearance.addChangeListener(({ colorScheme }) => setScheme(colorScheme ?? DEFAULT_APPEARANCE));
  //   return () => unsubscribe.remove();
  // }, []);

  return <AppearanceContext.Provider value={{ scheme, setScheme }}>{children}</AppearanceContext.Provider>;
};

const useAppearance = () => {
  return useContext(AppearanceContext);
};

export const withAppearance = (Component: (props: object) => JSX.Element) => {
  return (props: object) => (
    <AppearanceProvider>
      <Component {...props} />
    </AppearanceProvider>
  );
};

export default useAppearance;
