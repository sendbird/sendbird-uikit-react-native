import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

const DEFAULT_APPEARANCE = 'light';
const useAppearance = () => {
  const [scheme, setScheme] = useState<'light' | 'dark'>(Appearance.getColorScheme() ?? DEFAULT_APPEARANCE);
  useEffect(() => {
    const unsubscribe = Appearance.addChangeListener(({ colorScheme }) => setScheme(colorScheme ?? DEFAULT_APPEARANCE));
    return () => unsubscribe.remove();
  }, []);
  return scheme;
};

export default useAppearance;
