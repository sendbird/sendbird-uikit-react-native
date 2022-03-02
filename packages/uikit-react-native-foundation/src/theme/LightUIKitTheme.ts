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
        nav: {
          none: {
            background: Palette.background50,
            borderBottom: Palette.onBackgroundLight04,
          },
        },
      },
      button: {
        contained: {
          enabled: {
            background: Palette.primary300,
            content: Palette.onBackgroundDark01,
          },
          pressed: {
            background: Palette.primary400,
            content: Palette.onBackgroundDark01,
          },
          disabled: {
            background: Palette.background100,
            content: Palette.onBackgroundLight04,
          },
        },
        text: {
          enabled: {
            background: Palette.transparent,
            content: Palette.primary300,
          },
          pressed: {
            background: Palette.transparent,
            content: Palette.primary300,
          },
          disabled: {
            background: Palette.transparent,
            content: Palette.onBackgroundLight04,
          },
        },
      },
      dialog: {
        default: {
          none: {
            background: Palette.background50,
            text: Palette.onBackgroundLight01,
            message: Palette.onBackgroundLight02,
            highlight: Palette.primary300,
            destructive: Palette.error300,
          },
        },
      },
      input: {
        default: {
          active: {
            text: Palette.onBackgroundLight01,
            placeholder: Palette.onBackgroundLight03,
            background: Palette.background100,
            highlight: Palette.transparent,
          },
          disabled: {
            text: Palette.onBackgroundLight04,
            placeholder: Palette.onBackgroundLight04,
            background: Palette.background100,
            highlight: Palette.transparent,
          },
        },
        underline: {
          active: {
            text: Palette.onBackgroundLight01,
            placeholder: Palette.onBackgroundLight03,
            background: Palette.transparent,
            highlight: Palette.primary300,
          },
          disabled: {
            text: Palette.onBackgroundLight04,
            placeholder: Palette.onBackgroundLight04,
            background: Palette.transparent,
            highlight: Palette.onBackgroundLight04,
          },
        },
      },
    },
  },
};

export default LightUIKitTheme;
