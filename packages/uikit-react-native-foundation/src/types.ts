/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactElement, ReactNode } from 'react';
import type { TextStyle } from 'react-native';

import type Palette from './theme/Palette';

export type TypoName = `h${1 | 2}` | `subtitle${1 | 2}` | `body${1 | 2 | 3}` | 'button' | `caption${1 | 2 | 3 | 4}`;
export type FontAttributes = Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'fontWeight'>;
export type Typography = Record<TypoName, FontAttributes>;

export type UIKitAppearance = 'light' | 'dark';
export interface UIKitTheme extends AppearanceHelper {
  appearance: UIKitAppearance;
  colors: UIKitColors;
  palette: typeof Palette;
  typography: Typography;
}

export type InputState = 'active' | 'disabled';
export type ButtonState = 'enabled' | 'pressed' | 'disabled';
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
  ui: {
    header: {
      background: string;
      borderBottom: string;
    };
    input: {
      typeDefault: {
        text: string;
        background: string;
        placeholder: Record<InputState, string>;
      };
    };
    button: {
      typeContain: {
        background: Record<ButtonState, string>;
        text: Record<ButtonState, string>;
      };
      typeText: {
        background: Record<ButtonState, string>;
        text: Record<ButtonState, string>;
      };
    };
  };
  msg?: {
    bubble: {
      incoming: {
        default: string;
        pressed: string;
      };
      outgoing: {
        default: string;
        pressed: string;
      };
    };
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
  children?: ReactNode;
};
export type BaseHeaderProps<HeaderParts extends HeaderPartProps = {}, AdditionalProps = {}> = {
  titleAlign?: 'left' | 'center' | 'right';
} & HeaderParts &
  AdditionalProps;
