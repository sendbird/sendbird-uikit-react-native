import { themeFactory } from '../styles/themeFactory';
import Palette from './Palette';

const DarkUIKitTheme = themeFactory({
  appearance: 'dark',
  palette: Palette,
  colors: (palette) => ({
    primary: palette.primary200,
    background: palette.background600,
    text: palette.onBackgroundDark01,
    notification: palette.error200,
    onBackground01: palette.onBackgroundDark01,
    onBackground02: palette.onBackgroundDark02,
    onBackground03: palette.onBackgroundDark03,
    onBackground04: palette.onBackgroundDark04,
    onBackgroundReverse01: palette.onBackgroundLight01,
    onBackgroundReverse02: palette.onBackgroundLight02,
    onBackgroundReverse03: palette.onBackgroundLight03,
    onBackgroundReverse04: palette.onBackgroundLight04,
    secondary: palette.secondary200,
    error: palette.error200,
    ui: {
      header: {
        nav: {
          none: {
            background: palette.background500,
            borderBottom: palette.onBackgroundDark04,
          },
        },
      },
      button: {
        contained: {
          enabled: {
            background: palette.primary200,
            content: palette.onBackgroundLight01,
          },
          pressed: {
            background: palette.primary300,
            content: palette.onBackgroundLight01,
          },
          disabled: {
            background: palette.background500,
            content: palette.onBackgroundDark04,
          },
        },
        text: {
          enabled: {
            background: palette.transparent,
            content: palette.primary200,
          },
          pressed: {
            background: palette.background400,
            content: palette.primary200,
          },
          disabled: {
            background: palette.transparent,
            content: palette.onBackgroundDark04,
          },
        },
      },
      dialog: {
        default: {
          none: {
            background: palette.background500,
            text: palette.onBackgroundDark01,
            message: palette.onBackgroundDark02,
            highlight: palette.primary200,
            destructive: palette.error300,
          },
        },
      },
      input: {
        default: {
          active: {
            text: palette.onBackgroundDark01,
            placeholder: palette.onBackgroundDark03,
            background: palette.background400,
            highlight: palette.transparent,
          },
          disabled: {
            text: palette.onBackgroundDark04,
            placeholder: palette.onBackgroundDark04,
            background: palette.background400,
            highlight: palette.transparent,
          },
        },
        underline: {
          active: {
            text: palette.onBackgroundDark01,
            placeholder: palette.onBackgroundDark03,
            background: palette.transparent,
            highlight: palette.primary200,
          },
          disabled: {
            text: palette.onBackgroundDark04,
            placeholder: palette.onBackgroundDark04,
            background: palette.transparent,
            highlight: palette.onBackgroundDark04,
          },
        },
      },
      badge: {
        default: {
          none: {
            text: palette.background600,
            background: palette.primary200,
          },
        },
      },
      placeholder: {
        default: {
          none: {
            content: palette.onBackgroundDark03,
            highlight: palette.primary200,
          },
        },
      },
      message: {
        incoming: {
          enabled: {
            textMsg: palette.onBackgroundDark01,
            textEdited: palette.onBackgroundDark02,
            textTime: palette.onBackgroundDark03,
            textSenderName: palette.onBackgroundDark02,
            background: palette.background400,
          },
          pressed: {
            textMsg: palette.onBackgroundDark01,
            textEdited: palette.onBackgroundDark02,
            textTime: palette.onBackgroundDark03,
            textSenderName: palette.onBackgroundDark02,
            background: palette.primary500,
          },
        },
        outgoing: {
          enabled: {
            textMsg: palette.onBackgroundLight01,
            textEdited: palette.onBackgroundLight02,
            textTime: palette.onBackgroundDark03,
            textSenderName: palette.transparent,
            background: palette.primary200,
          },
          pressed: {
            textMsg: palette.onBackgroundLight01,
            textEdited: palette.onBackgroundLight02,
            textTime: palette.onBackgroundDark03,
            textSenderName: palette.transparent,
            background: palette.primary300,
          },
        },
      },
      dateSeparator: {
        default: {
          none: {
            text: palette.onBackgroundDark02,
            background: palette.overlay02,
          },
        },
      },
    },
  }),
});
export default DarkUIKitTheme;
