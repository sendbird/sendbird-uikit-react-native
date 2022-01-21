import type Palette from './theme/Palette';

export type InputState = 'active' | 'disabled';
export type ButtonState = 'enabled' | 'pressed' | 'disabled';

export interface UIKitTheme extends AppearanceHelper {
  appearance: UIKitAppearance;
  colors: UIKitColors;
  palette: typeof Palette;
}
export type UIKitAppearance = 'light' | 'dark';
export type UIKitColors = {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
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
  select<T>(options: { light: T; dark: T; default?: T }): T;
}
