/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactElement, ReactNode } from 'react';
import type { TextStyle } from 'react-native';

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
export type UIKitTypography = Record<TypoName, FontAttributes>;

export type UIKitAppearance = 'light' | 'dark';
export interface UIKitTheme {
  appearance: UIKitAppearance;
  select<T>(options: { light?: T; dark: T; default?: T } | { light: T; dark?: T; default?: T }): T;

  palette: UIKitPalette;
  colors: UIKitColors;

  typography: UIKitTypography;
  scaleFactor: (dp: number) => number;
}

type Component = 'Header' | 'Button' | 'Dialog' | 'Input' | 'Badge' | 'Placeholder' | 'Message' | 'DateSeparator';
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
    Message: 'incoming' | 'outgoing';
    DateSeparator: 'default';
  };
  State: {
    Header: 'none';
    Button: 'enabled' | 'pressed' | 'disabled';
    Dialog: 'none';
    Input: 'active' | 'disabled';
    Badge: 'none';
    Placeholder: 'none';
    Message: 'enabled' | 'pressed';
    DateSeparator: 'none';
  };
  ColorPart: {
    Header: 'background' | 'borderBottom';
    Button: 'background' | 'content';
    Dialog: 'background' | 'text' | 'message' | 'highlight' | 'destructive';
    Input: 'text' | 'placeholder' | 'background' | 'highlight';
    Badge: 'text' | 'background';
    Placeholder: 'content' | 'highlight';
    Message: 'textMsg' | 'textEdited' | 'textSenderName' | 'textTime' | 'background';
    DateSeparator: 'text' | 'background';
  };
}>;
type ComponentColors<T extends Component> = {
  [key in ComponentColorTree['Variant'][T]]: {
    [key in ComponentColorTree['State'][T]]: {
      [key in ComponentColorTree['ColorPart'][T]]: string;
    };
  };
};

export interface UIKitColors {
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
    message: ComponentColors<'Message'>;
    dateSeparator: ComponentColors<'DateSeparator'>;
  };
}

export type HeaderElement = string | ReactElement | null;
export type HeaderPartProps = {
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
export interface UIKitPalette {
  primary100: string;
  primary200: string;
  primary300: string;
  primary400: string;
  primary500: string;

  secondary100: string;
  secondary200: string;
  secondary300: string;
  secondary400: string;
  secondary500: string;

  error100: string;
  error200: string;
  error300: string;
  error400: string;
  error500: string;

  background50: string;
  background100: string;
  background200: string;
  background300: string;
  background400: string;
  background500: string;
  background600: string;
  background700: string;

  overlay01: string;
  overlay02: string;

  information: string;
  highlight: string;
  transparent: 'transparent';

  onBackgroundLight01: string;
  onBackgroundLight02: string;
  onBackgroundLight03: string;
  onBackgroundLight04: string;

  onBackgroundDark01: string;
  onBackgroundDark02: string;
  onBackgroundDark03: string;
  onBackgroundDark04: string;
}
