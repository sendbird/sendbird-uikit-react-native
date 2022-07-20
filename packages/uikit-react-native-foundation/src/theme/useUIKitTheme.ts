import { useContext } from 'react';

import type { UIKitTheme } from '../types';
import UIKitThemeContext from './UIKitThemeContext';

const useUIKitTheme = () => {
  const context = useContext(UIKitThemeContext);
  if (!context) throw Error('UIKitThemeContext is not provided');
  return context as UIKitTheme;
};

export default useUIKitTheme;
