import createTheme from './createTheme';

const LightUIKitTheme = createTheme({
  colorScheme: 'light',
  colors: (palette) => {
    return {
      primary: palette.primary300,
      secondary: palette.secondary300,
      error: palette.error300,
      background: palette.background50,
      text: palette.onBackgroundLight01,
      onBackground01: palette.onBackgroundLight01,
      onBackground02: palette.onBackgroundLight02,
      onBackground03: palette.onBackgroundLight03,
      onBackground04: palette.onBackgroundLight04,
      onBackgroundReverse01: palette.onBackgroundDark01,
      onBackgroundReverse02: palette.onBackgroundDark02,
      onBackgroundReverse03: palette.onBackgroundDark03,
      onBackgroundReverse04: palette.onBackgroundDark04,
      ui: {
        header: {
          nav: {
            none: {
              background: palette.background50,
              borderBottom: palette.onBackgroundLight04,
            },
          },
        },
        button: {
          contained: {
            enabled: {
              background: palette.primary300,
              content: palette.onBackgroundDark01,
            },
            pressed: {
              background: palette.primary400,
              content: palette.onBackgroundDark01,
            },
            disabled: {
              background: palette.background100,
              content: palette.onBackgroundLight04,
            },
          },
          text: {
            enabled: {
              background: palette.transparent,
              content: palette.primary300,
            },
            pressed: {
              background: palette.transparent,
              content: palette.primary300,
            },
            disabled: {
              background: palette.transparent,
              content: palette.onBackgroundLight04,
            },
          },
        },
        dialog: {
          default: {
            none: {
              background: palette.background50,
              text: palette.onBackgroundLight01,
              message: palette.onBackgroundLight02,
              highlight: palette.primary300,
              destructive: palette.error300,
              blurred: palette.onBackgroundLight04,
            },
          },
        },
        input: {
          default: {
            active: {
              text: palette.onBackgroundLight01,
              placeholder: palette.onBackgroundLight03,
              background: palette.background100,
              highlight: palette.primary300,
            },
            disabled: {
              text: palette.onBackgroundLight04,
              placeholder: palette.onBackgroundLight04,
              background: palette.background100,
              highlight: palette.onBackgroundLight04,
            },
          },
          underline: {
            active: {
              text: palette.onBackgroundLight01,
              placeholder: palette.onBackgroundLight03,
              background: palette.transparent,
              highlight: palette.primary300,
            },
            disabled: {
              text: palette.onBackgroundLight04,
              placeholder: palette.onBackgroundLight04,
              background: palette.transparent,
              highlight: palette.onBackgroundLight04,
            },
          },
        },
        badge: {
          default: {
            none: {
              text: palette.background50,
              background: palette.primary300,
            },
          },
        },
        placeholder: {
          default: {
            none: {
              content: palette.onBackgroundLight03,
              highlight: palette.primary300,
            },
          },
        },
        dateSeparator: {
          default: {
            none: {
              text: palette.onBackgroundDark01,
              background: palette.overlay02,
            },
          },
        },
        groupChannelMessage: {
          incoming: {
            enabled: {
              textMsg: palette.onBackgroundLight01,
              textEdited: palette.onBackgroundLight02,
              textTime: palette.onBackgroundLight03,
              textSenderName: palette.onBackgroundLight02,
              background: palette.background100,
              textVoicePlaytime: palette.onBackgroundLight01,
              voiceSpinner: palette.primary300,
              voiceProgressTrack: palette.background100,
              voiceActionIcon: palette.primary300,
              voiceActionIconBackground: palette.background50,
            },
            pressed: {
              textMsg: palette.onBackgroundLight01,
              textEdited: palette.onBackgroundLight02,
              textTime: palette.onBackgroundLight03,
              textSenderName: palette.onBackgroundLight02,
              background: palette.primary100,
              textVoicePlaytime: palette.onBackgroundLight01,
              voiceSpinner: palette.primary300,
              voiceProgressTrack: palette.background100,
              voiceActionIcon: palette.primary300,
              voiceActionIconBackground: palette.background50,
            },
          },
          outgoing: {
            enabled: {
              textMsg: palette.onBackgroundDark01,
              textEdited: palette.onBackgroundDark02,
              textTime: palette.onBackgroundLight03,
              textSenderName: palette.transparent,
              background: palette.primary300,
              textVoicePlaytime: palette.onBackgroundDark01,
              voiceSpinner: palette.primary200,
              voiceProgressTrack: palette.primary300,
              voiceActionIcon: palette.primary300,
              voiceActionIconBackground: palette.background50,
            },
            pressed: {
              textMsg: palette.onBackgroundDark01,
              textEdited: palette.onBackgroundDark02,
              textTime: palette.onBackgroundLight03,
              textSenderName: palette.transparent,
              background: palette.primary400,
              textVoicePlaytime: palette.onBackgroundDark01,
              voiceSpinner: palette.primary200,
              voiceProgressTrack: palette.primary300,
              voiceActionIcon: palette.primary300,
              voiceActionIconBackground: palette.background50,
            },
          },
        },
        groupChannelPreview: {
          default: {
            none: {
              textTitle: palette.onBackgroundLight01,
              textTitleCaption: palette.onBackgroundLight03,
              textBody: palette.onBackgroundLight03,
              bodyIcon: palette.onBackgroundLight02,
              memberCount: palette.onBackgroundLight02,
              background: palette.background50,
              coverBackground: palette.onBackgroundLight04,
              bodyIconBackground: palette.background100,
              separator: palette.onBackgroundLight04,
            },
          },
        },
        profileCard: {
          default: {
            none: {
              textUsername: palette.onBackgroundLight01,
              textBodyLabel: palette.onBackgroundLight02,
              textBody: palette.onBackgroundLight01,
              background: palette.background50,
            },
          },
        },
        reaction: {
          default: {
            enabled: {
              background: palette.transparent,
              highlight: palette.onBackgroundLight03,
            },
            selected: {
              background: palette.primary100,
              highlight: palette.primary300,
            },
          },
          rounded: {
            enabled: {
              background: palette.background100,
              highlight: palette.transparent,
            },
            selected: {
              background: palette.primary100,
              highlight: palette.transparent,
            },
          },
        },
        openChannelMessage: {
          default: {
            enabled: {
              background: palette.transparent,
              bubbleBackground: palette.background100,
              adminBackground: palette.background100,
              textMsg: palette.onBackgroundLight01,
              textMsgPostfix: palette.onBackgroundLight02,
              textSenderName: palette.onBackgroundLight02,
              textTime: palette.onBackgroundLight03,
              textOperator: palette.secondary300,
            },
            pressed: {
              background: palette.background100,
              bubbleBackground: palette.background300,
              adminBackground: palette.background100,
              textMsg: palette.onBackgroundLight01,
              textMsgPostfix: palette.onBackgroundLight02,
              textSenderName: palette.onBackgroundLight02,
              textTime: palette.onBackgroundLight03,
              textOperator: palette.secondary300,
            },
          },
        },
        openChannelPreview: {
          default: {
            none: {
              textTitle: palette.onBackgroundLight01,
              textParticipants: palette.onBackgroundLight02,
              frozenIcon: palette.primary300,
              participantsIcon: palette.onBackgroundLight02,
              background: palette.background50,
              coverBackground: palette.background300,
              separator: palette.onBackgroundLight04,
            },
          },
        },
        voiceMessageInput: {
          default: {
            active: {
              textCancel: palette.primary300,
              textTime: palette.onBackgroundDark01,
              background: palette.background50,
              actionIcon: palette.onBackgroundLight01,
              actionIconBackground: palette.background100,
              sendIcon: palette.onBackgroundDark01,
              sendIconBackground: palette.primary300,
              progressTrack: palette.primary300,
              recording: palette.error300,
            },
            inactive: {
              textCancel: palette.primary300,
              textTime: palette.onBackgroundLight03,
              background: palette.background50,
              actionIcon: palette.onBackgroundLight01,
              actionIconBackground: palette.background100,
              sendIcon: palette.onBackgroundLight04,
              sendIconBackground: palette.background100,
              progressTrack: palette.background100,
              recording: palette.error300,
            },
          },
        },
      },
    };
  },
});

export default LightUIKitTheme;
