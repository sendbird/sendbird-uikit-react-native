import React from 'react';
import { Text, View } from 'react-native';

import {
  LightUIKitTheme,
  Palette as CustomPalette,
  UIKitColors,
  createTheme,
} from '@sendbird/uikit-react-native-foundation';

/**
 * UIKitPalette
 * {@link https://sendbird.com/docs/uikit/v3/react-native/resources/color-resource#2-uikitpalette}
 * */
import type { UIKitPalette } from '@sendbird/uikit-react-native-foundation';

const Palette: UIKitPalette = {
  primary100: '#DBD1FF',
  primary200: '#C2A9FA',
  primary300: '#742DDD',
  primary400: '#6211C8',
  primary500: '#491389',

  secondary100: '#A8E2AB',
  secondary200: '#69C085',
  secondary300: '#259C72',
  secondary400: '#027D69',
  secondary500: '#066858',

  error100: '#FDAAAA',
  error200: '#F66161',
  error300: '#DE360B',
  error400: '#BF0711',
  error500: '#9D091E',

  background50: '#FFFFFF',
  background100: '#EEEEEE',
  background200: '#E0E0E0',
  background300: '#BDBDBD',
  background400: '#393939',
  background500: '#2C2C2C',
  background600: '#161616',
  background700: '#000000',

  overlay01: 'rgba(0,0,0,0.55)',
  overlay02: 'rgba(0,0,0,0.32)',

  information: '#ADC9FF',
  highlight: '#FFF2B6',
  transparent: 'transparent',

  onBackgroundLight01: 'rgba(0,0,0,0.88)',
  onBackgroundLight02: 'rgba(0,0,0,0.50)',
  onBackgroundLight03: 'rgba(0,0,0,0.38)',
  onBackgroundLight04: 'rgba(0,0,0,0.12)',

  onBackgroundDark01: 'rgba(255,255,255,0.88)',
  onBackgroundDark02: 'rgba(255,255,255,0.50)',
  onBackgroundDark03: 'rgba(255,255,255,0.38)',
  onBackgroundDark04: 'rgba(255,255,255,0.12)',
};
/** ------------------ **/

/**
 * UIKitColors
 * {@link https://sendbird.com/docs/uikit/v3/react-native/resources/color-resource#2-uikitpalette}
 * */
function uikitColors(_: UIKitColors) {
  const {
    primary,
    secondary,
    error,
    background,
    text,
    onBackground01,
    onBackground02,
    onBackground03,
    onBackground04,
    onBackgroundReverse01,
    onBackgroundReverse02,
    onBackgroundReverse03,
    onBackgroundReverse04,
    ui: {
      header, input, button, dialog, dateSeparator, placeholder, badge, reaction, profileCard,
      groupChannelPreview, groupChannelMessage, openChannelPreview, openChannelMessage
    },
  } = _;
}

// --------

import { useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

const Component = () => {
  const { colors } = useUIKitTheme();
  const buttonBackground = colors.ui.button.contained.disabled.background;
}
/** ------------------ **/

/**
 * How to use
 * {@link https://sendbird.com/docs/uikit/v3/react-native/resources/color-resource#2-how-to-use}
 * */
// import { useUIKitTheme } from '@sendbird/uikit-react-native-foundation';
// import { View, Text } from 'react-native';

const Component2 = () => {
  const { palette, colors } = useUIKitTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>{'Text'}</Text>
    </View>
  );
};
/** ------------------ **/

/**
 * Customize with default themes
 * {@link https://sendbird.com/docs/uikit/v3/react-native/resources/color-resource#2-customize-the-colors-3-customize-with-default-themes}
 * */
// import { LightUIKitTheme, Palette } from '@sendbird/uikit-react-native-foundation';

LightUIKitTheme.palette = {
  ...Palette,
  primary100: 'red',
  primary200: 'red',
  primary300: 'red',
  primary400: 'red',
  primary500: 'red',
};

LightUIKitTheme.colors.ui.button.contained = {
  enabled: {
    content: LightUIKitTheme.palette.background50,
    background: LightUIKitTheme.palette.primary100,
  },
  disabled: {
    content: LightUIKitTheme.palette.background50,
    background: LightUIKitTheme.palette.primary100,
  },
  pressed: {
    content: LightUIKitTheme.palette.background50,
    background: LightUIKitTheme.palette.primary100,
  },
};
/** ------------------ **/

/**
 * Customize the createTheme()
 * {@link https://sendbird.com/docs/uikit/v3/react-native/resources/color-resource#2-customize-the-colors-3-customize-with-createtheme-}
 * */
import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';
// import { createTheme } from '@sendbird/uikit-react-native-foundation';

const CustomTheme = createTheme({
  colorScheme: 'light',
  palette: CustomPalette,
  colors: (palette) => ({
    ...LightUIKitTheme.colors,
    ui: {
      ...LightUIKitTheme.colors.ui,
      button: {
        contained: {
          enabled: {
            content: palette.background300,
            background: palette.onBackgroundLight03,
          },
          disabled: {
            content: palette.background300,
            background: palette.onBackgroundLight03,
          },
          pressed: {
            content: palette.background300,
            background: palette.onBackgroundLight03,
          },
        },
        text: {
          enabled: {
            content: palette.background300,
            background: palette.onBackgroundLight03,
          },
          disabled: {
            content: palette.background300,
            background: palette.onBackgroundLight03,
          },
          pressed: {
            content: palette.background300,
            background: palette.onBackgroundLight03,
          },
        },
      },
    },
  }),
});

const App = () => {
  return (
    // @ts-ignore
    <SendbirdUIKitContainer styles={{ theme: CustomTheme }}>
      {/* ... */}
    </SendbirdUIKitContainer>
  );
};
/** ------------------ **/
