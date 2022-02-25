/** Theme **/
export { default as Palette } from './theme/Palette';
export { default as useUIKitTheme } from './theme/useUIKitTheme';
export { default as DarkUIKitTheme } from './theme/DarkUIKitTheme';
export { default as LightUIKitTheme } from './theme/LightUIKitTheme';
export { default as UIKitThemeProvider } from './theme/UIKitThemeProvider';

/** UI **/
export { default as Icon } from './ui/Icon';
export { default as Text } from './ui/Text';
export { default as Modal } from './ui/Modal';
export { default as Header } from './ui/Header';
export { default as Avatar } from './ui/Avatar';
export { default as ActionMenu } from './ui/ActionMenu';

/** Styles **/
export { default as useHeaderStyle } from './styles/useHeaderStyle';
export { default as getDefaultHeaderHeight } from './styles/getDefaultHeaderHeight';
export { default as appearanceHelper } from './styles/appearanceHelper';
export { default as scaleFactor } from './styles/scaleFactor';
export { default as createStyleSheet } from './styles/createStyleSheet';
export { HeaderStyleContext, HeaderStyleProvider } from './styles/HeaderStyleContext';

/** Types **/
export type {
  TypoName,
  UIKitTheme,
  InputState,
  Typography,
  UIKitColors,
  ButtonState,
  FontAttributes,
  BaseHeaderProps,
  UIKitAppearance,
  AppearanceHelper,
} from './types';
