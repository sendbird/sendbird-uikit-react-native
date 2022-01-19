import type { UIKitTheme } from '../types';
import appearanceHelperFactory from '../utils/appearanceHelper';
import Palette from './Palette';

const appearance = 'light';
const LightUIKitTheme: UIKitTheme = {
  ...appearanceHelperFactory(appearance),
  appearance,
  palette: Palette,
  colors: {
    primary: Palette.primary300,
    background: Palette.background50,
    card: Palette.background50,
    text: Palette.onBackgroundLight01,
    border: Palette.onBackgroundLight04,
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
      input: {
        text: Palette.onBackgroundLight01,
        background: Palette.background100,
        placeholder: {
          active: Palette.onBackgroundLight03,
          disabled: Palette.onBackgroundLight04,
        },
      },
      button: {
        contained: {
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
        text: {
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
