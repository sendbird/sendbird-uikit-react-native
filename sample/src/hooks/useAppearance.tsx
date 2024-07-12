import React, { createContext, useContext, useState } from 'react';
import { Appearance } from 'react-native';

import { NOOP, useAsyncLayoutEffect } from '@sendbird/uikit-utils';

import { mmkv } from '../factory/mmkv';

const DEFAULT_APPEARANCE = 'light';

const AppearanceContext = createContext<{ scheme: 'light' | 'dark'; setScheme: (val: 'light' | 'dark') => void }>({
  scheme: DEFAULT_APPEARANCE,
  setScheme: NOOP,
});

const SchemeManager = {
  KEY: 'sendbird@scheme',
  async get() {
    return (mmkv.getString(SchemeManager.KEY) ?? Appearance.getColorScheme() ?? DEFAULT_APPEARANCE) as 'light' | 'dark';
  },
  async set(scheme: 'light' | 'dark') {
    mmkv.set(SchemeManager.KEY, scheme);
  },
};

export const AppearanceProvider = ({ children }: React.PropsWithChildren) => {
  const [scheme, setScheme] = useState<'light' | 'dark'>(Appearance.getColorScheme() ?? DEFAULT_APPEARANCE);

  useAsyncLayoutEffect(async () => {
    setScheme(await SchemeManager.get());
  }, []);

  // Handle scheme from Settings screen.
  // useEffect(() => {
  //   const unsubscribe = Appearance.addChangeListener(({ colorScheme }) => setScheme(colorScheme ?? DEFAULT_APPEARANCE));
  //   return () => unsubscribe.remove();
  // }, []);

  return (
    <AppearanceContext.Provider
      value={{
        scheme,
        setScheme: async (value) => {
          setScheme(value);
          await SchemeManager.set(value);
        },
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
};

const useAppearance = () => {
  return useContext(AppearanceContext);
};

export const withAppearance = (Component: (props: object) => React.ReactNode) => {
  return (props: object) => (
    <AppearanceProvider>
      <Component {...props} />
    </AppearanceProvider>
  );
};

export default useAppearance;
