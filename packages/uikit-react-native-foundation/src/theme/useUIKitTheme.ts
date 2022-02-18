import { useContext } from 'react';

import UIKitThemeContext from './UIKitThemeContext';

const useUIKitTheme = () => {
  const context = useContext(UIKitThemeContext);
  if (!context) throw Error('UIKitThemeContext is not provided');
  return context;
};

export default useUIKitTheme;
