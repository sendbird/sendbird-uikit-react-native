import { useContext } from 'react';

import type { UIKitTheme } from '../types';
import UIKitThemeContext from './UIKitThemeContext';

const useUIKitTheme = <Appearance extends string = 'default'>() => {
  const context = useContext(UIKitThemeContext);
  if (!context) throw Error('UIKitThemeContext is not provided');
  return context as UIKitTheme<Appearance>;
};

export default useUIKitTheme;
