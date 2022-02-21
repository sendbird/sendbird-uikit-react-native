import createAppearanceHelper from '../styles/appearanceHelper';
import type { UIKitTheme } from '../types';
import Palette from './Palette';
import { defaultTypography } from './Typography';

const appearance = 'light';
const LightUIKitTheme: UIKitTheme = {
  ...createAppearanceHelper(appearance),
  typography: defaultTypography,
  appearance,
  palette: Palette,
  colors: {
    primary: Palette.primary300,
    background: Palette.background50,
    text: Palette.onBackgroundLight01,
    notification: Palette.error300,
    onBackground01: Palette.onBackgroundLight01,
    onBackground02: Palette.onBackgroundLight02,
    onBackground03: Palette.onBackgroundLight03,
    onBackground04: Palette.onBackgroundLight04,
    onBackgroundReverse01: Palette.onBackgroundDark01,
    onBackgroundReverse02: Palette.onBackgroundDark02,
    onBackgroundReverse03: Palette.onBackgroundDark03,
    onBackgroundReverse04: Palette.onBackgroundDark04,
    secondary: Palette.secondary300,
    error: Palette.error300,
    ui: {
      header: {
        background: Palette.background50,
        borderBottom: Palette.onBackgroundLight04,
      },
      input: {
        typeDefault: {
          text: Palette.onBackgroundLight01,
          background: Palette.background100,
          placeholder: {
            active: Palette.onBackgroundLight03,
            disabled: Palette.onBackgroundLight04,
          },
        },
      },
      button: {
        typeContain: {
          background: {
            enabled: Palette.primary300,
            pressed: Palette.primary500,
            disabled: Palette.background100,
          },
          text: {
            enabled: Palette.onBackgroundDark01,
            pressed: Palette.onBackgroundDark01,
            disabled: Palette.onBackgroundDark04,
          },
        },
        typeText: {
          background: {
            enabled: Palette.transparent,
            pressed: Palette.background100,
            disabled: Palette.transparent,
          },
          text: {
            enabled: Palette.primary300,
            pressed: Palette.primary300,
            disabled: Palette.onBackgroundLight04,
          },
        },
      },
    },
  },
};

export default LightUIKitTheme;
