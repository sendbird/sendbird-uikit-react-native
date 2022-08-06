import React from 'react';

import type { UIKitTheme } from '../types';
import LightUIKitTheme from './LightUIKitTheme';
import UIKitThemeContext from './UIKitThemeContext';

type Props = React.PropsWithChildren<{
  theme?: UIKitTheme;
}>;
const UIKitThemeProvider = ({ children, theme = LightUIKitTheme }: Props) => {
  return <UIKitThemeContext.Provider value={theme}>{children}</UIKitThemeContext.Provider>;
};

export default UIKitThemeProvider;
