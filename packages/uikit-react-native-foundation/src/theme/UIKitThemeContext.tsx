import React from 'react';

import type { UIKitTheme } from '../types';

const UIKitThemeContext = React.createContext<UIKitTheme | null>(null);

export default UIKitThemeContext;
