import React from 'react';

import type { UIKitTheme } from '../types';
import LightUIKitTheme from './LightUIKitTheme';
import UIKitThemeContext from './UIKitThemeContext';

type Props = {
  value: UIKitTheme;
};

const UIKitThemeProvider: React.FC<Props> = ({ children, value = LightUIKitTheme }) => {
  return <UIKitThemeContext.Provider value={value}>{children}</UIKitThemeContext.Provider>;
};

export default UIKitThemeProvider;
