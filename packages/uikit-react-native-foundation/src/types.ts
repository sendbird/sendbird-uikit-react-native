/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';
import type { TextStyle } from 'react-native';

export interface UIKitTypography {
  h1: FontAttributes;
  h2: FontAttributes;
  subtitle1: FontAttributes;
  subtitle2: FontAttributes;
  body1: FontAttributes;
  body2: FontAttributes;
  body3: FontAttributes;
  button: FontAttributes;
  caption1: FontAttributes;
  caption2: FontAttributes;
  caption3: FontAttributes;
  caption4: FontAttributes;
}
export type TypoName = keyof UIKitTypography;
export type FontAttributes = Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'fontWeight'>;

export type UIKitColorScheme = 'light' | 'dark';
export interface UIKitTheme {
  colorScheme: UIKitColorScheme;
  select<V>(options: { [key in UIKitColorScheme | 'default']?: V }): V;

  palette: UIKitPalette;
  colors: UIKitColors;

  typography: UIKitTypography;
}

export type Component =
  | 'Header'
  | 'Button'
  | 'Dialog'
  | 'Input'
  | 'Badge'
  | 'Placeholder'
  | 'DateSeparator'
  | 'GroupChannelMessage'
  | 'GroupChannelPreview'
  | 'ProfileCard'
  | 'Reaction'
  | 'OpenChannelMessage'
  | 'OpenChannelPreview'
  | 'VoiceMessageInput';

export type GetColorTree<
  Tree extends {
    Variant: {
      [key in Component]: string;
    };
    State: {
      [key in Component]: string;
    };
    ColorPart: {
      [key in Component]: string;
    };
  },
> = Tree;

export type ComponentColorTree = GetColorTree<{
  Variant: {
    Header: 'nav';
    Button: 'contained' | 'text';
    Dialog: 'default';
    Input: 'default' | 'underline';
    Badge: 'default';
    Placeholder: 'default';
    DateSeparator: 'default';
    GroupChannelMessage: 'incoming' | 'outgoing';
    GroupChannelPreview: 'default';
    ProfileCard: 'default';
    Reaction: 'default' | 'rounded';
    OpenChannelMessage: 'default';
    OpenChannelPreview: 'default';
    VoiceMessageInput: 'default';
  };
  State: {
    Header: 'none';
    Button: 'enabled' | 'pressed' | 'disabled';
    Dialog: 'none';
    Input: 'active' | 'disabled';
    Badge: 'none';
    Placeholder: 'none';
    DateSeparator: 'none';
    GroupChannelMessage: 'enabled' | 'pressed';
    GroupChannelPreview: 'none';
    ProfileCard: 'none';
    Reaction: 'enabled' | 'selected';
    OpenChannelMessage: 'enabled' | 'pressed';
    OpenChannelPreview: 'none';
    VoiceMessageInput: 'active' | 'inactive';
  };
  ColorPart: {
    Header: 'background' | 'borderBottom';
    Button: 'background' | 'content';
    Dialog: 'background' | 'text' | 'message' | 'highlight' | 'destructive' | 'blurred';
    Input: 'text' | 'placeholder' | 'background' | 'highlight';
    Badge: 'text' | 'background';
    Placeholder: 'content' | 'highlight';
    DateSeparator: 'text' | 'background';
    GroupChannelMessage:
      | 'textMsg'
      | 'textEdited'
      | 'textSenderName'
      | 'textTime'
      | 'textVoicePlaytime'
      | 'background'
      | 'voiceSpinner'
      | 'voiceProgressTrack'
      | 'voiceActionIcon'
      | 'voiceActionIconBackground';
    GroupChannelPreview:
      | 'textTitle'
      | 'textTitleCaption'
      | 'textBody'
      | 'memberCount'
      | 'bodyIcon'
      | 'background'
      | 'coverBackground'
      | 'bodyIconBackground'
      | 'separator';
    ProfileCard: 'textUsername' | 'textBodyLabel' | 'textBody' | 'background';
    Reaction: 'background' | 'highlight';
    OpenChannelMessage:
      | 'textMsg'
      | 'textMsgPostfix'
      | 'textSenderName'
      | 'textTime'
      | 'textOperator'
      | 'background'
      | 'bubbleBackground'
      | 'adminBackground';
    OpenChannelPreview:
      | 'textTitle'
      | 'textParticipants'
      | 'frozenIcon'
      | 'participantsIcon'
      | 'background'
      | 'coverBackground'
      | 'separator';
    VoiceMessageInput:
      | 'textCancel'
      | 'textTime'
      | 'background'
      | 'actionIcon'
      | 'actionIconBackground'
      | 'sendIcon'
      | 'sendIconBackground'
      | 'progressTrack'
      | 'recording';
  };
}>;
export type ComponentColors<T extends Component> = {
  [key in ComponentColorTree['Variant'][T]]: {
    [key in ComponentColorTree['State'][T]]: {
      [key in ComponentColorTree['ColorPart'][T]]: string;
    };
  };
};

export interface UIKitColors {
  primary: string;
  secondary: string;
  error: string;
  background: string;
  text: string;
  onBackground01: string;
  onBackground02: string;
  onBackground03: string;
  onBackground04: string;
  onBackgroundReverse01: string;
  onBackgroundReverse02: string;
  onBackgroundReverse03: string;
  onBackgroundReverse04: string;
  /**
   * UI Colors has below structure
   * Component.{Variant}.{State}.{ColorPart}
   * @example
   * ```
   *  const { colors } = useUIKitTheme();
   *  colors.ui.button.contained.disabled.backgroundColor
   * ```
   * */
  ui: {
    header: ComponentColors<'Header'>;
    button: ComponentColors<'Button'>;
    dialog: ComponentColors<'Dialog'>;
    input: ComponentColors<'Input'>;
    badge: ComponentColors<'Badge'>;
    placeholder: ComponentColors<'Placeholder'>;
    dateSeparator: ComponentColors<'DateSeparator'>;
    groupChannelMessage: ComponentColors<'GroupChannelMessage'>;
    groupChannelPreview: ComponentColors<'GroupChannelPreview'>;
    profileCard: ComponentColors<'ProfileCard'>;
    reaction: ComponentColors<'Reaction'>;
    openChannelMessage: ComponentColors<'OpenChannelMessage'>;
    openChannelPreview: ComponentColors<'OpenChannelPreview'>;
    voiceMessageInput: ComponentColors<'VoiceMessageInput'>;
  };
}

export type HeaderElement = ReactNode;
export type HeaderPartProps = {
  title?: ReactNode;
  right?: ReactNode;
  left?: ReactNode;
  onPressLeft?: (...params: any[]) => any;
  onPressRight?: (...params: any[]) => any;
};
export type BaseHeaderProps<HeaderParts extends HeaderPartProps = {}, AdditionalProps = {}> = {
  titleAlign?: 'left' | 'center' | 'right';
  children?: ReactNode;
} & HeaderParts &
  AdditionalProps;
export interface UIKitPalette {
  primary100: string;
  primary200: string;
  primary300: string;
  primary400: string;
  primary500: string;

  secondary100: string;
  secondary200: string;
  secondary300: string;
  secondary400: string;
  secondary500: string;

  error100: string;
  error200: string;
  error300: string;
  error400: string;
  error500: string;

  background50: string;
  background100: string;
  background200: string;
  background300: string;
  background400: string;
  background500: string;
  background600: string;
  background700: string;

  overlay01: string;
  overlay02: string;

  information: string;
  highlight: string;
  transparent: 'transparent';

  onBackgroundLight01: string;
  onBackgroundLight02: string;
  onBackgroundLight03: string;
  onBackgroundLight04: string;

  onBackgroundDark01: string;
  onBackgroundDark02: string;
  onBackgroundDark03: string;
  onBackgroundDark04: string;
}
