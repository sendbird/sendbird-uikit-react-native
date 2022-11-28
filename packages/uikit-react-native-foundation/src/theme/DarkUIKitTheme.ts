import createTheme from './createTheme';

const DarkUIKitTheme = createTheme({
  colorScheme: 'dark',
  colors: (palette) => ({
    primary: palette.primary200,
    secondary: palette.secondary200,
    error: palette.error200,
    background: palette.background600,
    text: palette.onBackgroundDark01,
    onBackground01: palette.onBackgroundDark01,
    onBackground02: palette.onBackgroundDark02,
    onBackground03: palette.onBackgroundDark03,
    onBackground04: palette.onBackgroundDark04,
    onBackgroundReverse01: palette.onBackgroundLight01,
    onBackgroundReverse02: palette.onBackgroundLight02,
    onBackgroundReverse03: palette.onBackgroundLight03,
    onBackgroundReverse04: palette.onBackgroundLight04,
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
            highlight: palette.primary200,
          },
          disabled: {
            text: palette.onBackgroundDark04,
            placeholder: palette.onBackgroundDark04,
            background: palette.background400,
            highlight: palette.onBackgroundDark04,
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
      groupChannelPreview: {
        default: {
          none: {
            textTitle: palette.onBackgroundDark01,
            textTitleCaption: palette.onBackgroundDark03,
            textBody: palette.onBackgroundDark03,
            bodyIcon: palette.onBackgroundDark02,
            memberCount: palette.onBackgroundDark02,
            background: palette.background600,
            coverBackground: palette.onBackgroundDark04,
            bodyIconBackground: palette.background500,
            separator: palette.onBackgroundDark04,
          },
        },
      },
      profileCard: {
        default: {
          none: {
            textUsername: palette.onBackgroundDark01,
            textBodyLabel: palette.onBackgroundDark02,
            textBody: palette.onBackgroundDark01,
            background: palette.background500,
          },
        },
      },
      reaction: {
        default: {
          enabled: {
            background: palette.transparent,
            highlight: palette.onBackgroundDark03,
          },
          selected: {
            background: palette.primary500,
            highlight: palette.primary200,
          },
        },
        rounded: {
          enabled: {
            background: palette.background400,
            highlight: palette.transparent,
          },
          selected: {
            background: palette.primary500,
            highlight: palette.transparent,
          },
        },
      },
    },
  }),
});

export default DarkUIKitTheme;
