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
        nav: {
          none: {
            background: Palette.background500,
            borderBottom: Palette.onBackgroundDark04,
          },
        },
      },
      button: {
        contained: {
          enabled: {
            background: Palette.primary200,
            content: Palette.onBackgroundLight01,
          },
          pressed: {
            background: Palette.primary300,
            content: Palette.onBackgroundLight01,
          },
          disabled: {
            background: Palette.background500,
            content: Palette.onBackgroundDark04,
          },
        },
        text: {
          enabled: {
            background: Palette.transparent,
            content: Palette.primary200,
          },
          pressed: {
            background: Palette.background400,
            content: Palette.primary200,
          },
          disabled: {
            background: Palette.transparent,
            content: Palette.onBackgroundDark04,
          },
        },
      },
      dialog: {
        default: {
          none: {
            background: Palette.background500,
            text: Palette.onBackgroundDark01,
            message: Palette.onBackgroundDark02,
            highlight: Palette.primary200,
            destructive: Palette.error300,
          },
        },
      },
      // input: {
      //   typeDefault: {
      //     text: Palette.onBackgroundDark01,
      //     background: Palette.background400,
      //     placeholder: {
      //       active: Palette.onBackgroundDark03,
      //       disabled: Palette.onBackgroundDark04,
      //     },
      //   },
      // },
    },
  },
};

export default DarkUIKitTheme;
