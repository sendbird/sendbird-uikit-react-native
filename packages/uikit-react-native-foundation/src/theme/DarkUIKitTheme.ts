import createAppearanceHelper from '../styles/appearanceHelper';
import type { UIKitTheme } from '../types';
import Palette from './Palette';
import { defaultTypography } from './Typography';

const appearance = 'dark';
const DarkUIKitTheme: UIKitTheme = {
  ...createAppearanceHelper(appearance),
  typography: defaultTypography,
  appearance,
  palette: Palette,
  colors: {
    primary: Palette.primary200,
    background: Palette.background600,
    text: Palette.onBackgroundDark01,
    notification: Palette.error200,
    onBackground01: Palette.onBackgroundDark01,
    onBackground02: Palette.onBackgroundDark02,
    onBackground03: Palette.onBackgroundDark03,
    onBackground04: Palette.onBackgroundDark04,
    onBackgroundReverse01: Palette.onBackgroundLight01,
    onBackgroundReverse02: Palette.onBackgroundLight02,
    onBackgroundReverse03: Palette.onBackgroundLight03,
    onBackgroundReverse04: Palette.onBackgroundLight04,
    secondary: Palette.secondary200,
    error: Palette.error200,
    ui: {
      header: {
        background: Palette.background500,
        borderBottom: Palette.onBackgroundDark04,
      },
      input: {
        typeDefault: {
          text: Palette.onBackgroundDark01,
          background: Palette.background400,
          placeholder: {
            active: Palette.onBackgroundDark03,
            disabled: Palette.onBackgroundDark04,
          },
        },
      },
      button: {
        typeContain: {
          background: {
            enabled: Palette.primary200,
            pressed: Palette.primary300,
            disabled: Palette.background500,
          },
          text: {
            enabled: Palette.onBackgroundLight01,
            pressed: Palette.onBackgroundLight01,
            disabled: Palette.onBackgroundDark04,
          },
        },
        typeText: {
          background: {
            enabled: Palette.transparent,
            pressed: Palette.background500,
            disabled: Palette.transparent,
          },
          text: {
            enabled: Palette.primary200,
            pressed: Palette.primary200,
            disabled: Palette.onBackgroundDark04,
          },
        },
      },
    },
  },
};

export default DarkUIKitTheme;
