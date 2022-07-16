import React from 'react';

import type { UIKitTheme } from '../types';
import LightUIKitTheme from './LightUIKitTheme';
import UIKitThemeContext from './UIKitThemeContext';

type Props = { theme?: UIKitTheme };
const UIKitThemeProvider: React.FC<Props> = ({ children, theme = LightUIKitTheme }) => {
  return <UIKitThemeContext.Provider value={theme}>{children}</UIKitThemeContext.Provider>;
};

export default UIKitThemeProvider;
