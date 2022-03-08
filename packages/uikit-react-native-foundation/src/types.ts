/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactElement, ReactNode } from 'react';
import type { TextStyle } from 'react-native';

import type Palette from './theme/Palette';

export type TypoName =
  | 'h1'
  | 'h2'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'button'
  | 'caption1'
  | 'caption2'
  | 'caption3'
  | 'caption4';
export type FontAttributes = Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'fontWeight'>;
export type Typography = Record<TypoName, FontAttributes>;

export type UIKitAppearance = 'light' | 'dark';
export interface UIKitTheme extends AppearanceHelper {
  appearance: UIKitAppearance;
  colors: UIKitColors;
  palette: typeof Palette;
  typography: Typography;
}

type Component = 'Header' | 'Button' | 'Dialog' | 'Input' | 'Badge' | 'Placeholder';
type GetColorTree<
  Tree extends {
    Variant: {
      [key in Component]: string;
    };
    State: {
      [key in Component]: string;
    };
    ColorPart: {
      [key in Component]: string;
    };
  },
> = Tree;

export type ComponentColorTree = GetColorTree<{
  Variant: {
    Header: 'nav';
    Button: 'contained' | 'text';
    Dialog: 'default';
    Input: 'default' | 'underline';
    Badge: 'default';
    Placeholder: 'default';
  };
  State: {
    Header: 'none';
    Button: 'enabled' | 'pressed' | 'disabled';
    Dialog: 'none';
    Input: 'active' | 'disabled';
    Badge: 'none';
    Placeholder: 'none';
  };
  ColorPart: {
    Header: 'background' | 'borderBottom';
    Button: 'background' | 'content';
    Dialog: 'background' | 'text' | 'message' | 'highlight' | 'destructive';
    Input: 'text' | 'placeholder' | 'background' | 'highlight';
    Badge: 'text' | 'background';
    Placeholder: 'content' | 'highlight';
  };
}>;
type ComponentColors<T extends Component> = {
  [key in ComponentColorTree['Variant'][T]]: {
    [key in ComponentColorTree['State'][T]]: {
      [key in ComponentColorTree['ColorPart'][T]]: string;
    };
  };
};

export type UIKitColors = {
  primary: string;
  background: string;
  text: string;
  notification: string;
  onBackground01: string;
  onBackground02: string;
  onBackground03: string;
  onBackground04: string;
  onBackgroundReverse01: string;
  onBackgroundReverse02: string;
  onBackgroundReverse03: string;
  onBackgroundReverse04: string;
  secondary: string;
  error: string;
  /**
   * UI Colors has below structure
   * Component.{Variant}.{State}.{ColorPart}
   * @example
   * ```
   *  const { colors } = useUIKitTheme();
   *  colors.button.contained.disabled.backgroundColor
   * ```
   * */
  ui: {
    header: ComponentColors<'Header'>;
    button: ComponentColors<'Button'>;
    dialog: ComponentColors<'Dialog'>;
    input: ComponentColors<'Input'>;
    badge: ComponentColors<'Badge'>;
    placeholder: ComponentColors<'Placeholder'>;
  };
};

export interface AppearanceHelper {
  select<T>(options: { light?: T; dark: T; default?: T } | { light: T; dark?: T; default?: T }): T;
}

type HeaderElement = string | ReactElement | null;
type HeaderPartProps = {
  title?: HeaderElement;
  right?: HeaderElement;
  left?: HeaderElement;
  onPressLeft?: (...params: any[]) => any;
  onPressRight?: (...params: any[]) => any;
};
export type BaseHeaderProps<HeaderParts extends HeaderPartProps = {}, AdditionalProps = {}> = {
  titleAlign?: 'left' | 'center' | 'right';
  children?: ReactNode;
} & HeaderParts &
  AdditionalProps;
