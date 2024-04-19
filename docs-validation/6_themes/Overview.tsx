import React from 'react';

import {
  Palette,
  UIKitColorScheme,
  UIKitPalette,
  UIKitTheme,
  createTheme,
} from '@gathertown/uikit-react-native-foundation';

const CustomPalette: UIKitPalette = Palette;

/**
 * Themes
 * {@link https://sendbird.com/docs/uikit/v3/react-native/themes/overview#1-themes}
 * */
import { useColorScheme, View, Text } from 'react-native';

import { SendbirdUIKitContainer } from '@gathertown/uikit-react-native';
import { DarkUIKitTheme, LightUIKitTheme } from '@gathertown/uikit-react-native-foundation';

const App = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'light' ? LightUIKitTheme : DarkUIKitTheme;

  return (
    // @ts-ignore
    <SendbirdUIKitContainer styles={{ theme }}>
      {/* ... */}
    </SendbirdUIKitContainer>
  );
};
/** ------------------ **/

/**
 * UIKitTheme
 * {@link https://sendbird.com/docs/uikit/v3/react-native/themes/overview#2-uikittheme}
 * */
function colorScheme(_: UIKitColorScheme) {
  switch (_) {
    case 'dark':
    case 'light':
  }
}
function theme(_: UIKitTheme) {
  _.colorScheme;
  _.select({ dark: '', default: '', light: '' });
  _.palette;
  _.colors;
  _.typography;
}
/** ------------------ **/

/**
 * How to use
 * {@link https://sendbird.com/docs/uikit/v3/react-native/themes/overview#2-how-to-use}
 * */
import { useUIKitTheme } from '@gathertown/uikit-react-native-foundation';

const Component = () => {
  const { colors } = useUIKitTheme();
  return (
    <View style={{ backgroundColor: colors.onBackground04 }}>
      <Text style={{ color: colors.primary }}>{'Theme'}</Text>
    </View>
  );
};
/** ------------------ **/

/**
 * Customize the theme
 * {@link https://sendbird.com/docs/uikit/v3/react-native/themes/overview#2-customize-the-theme}
 * */
// import { DarkUIKitTheme, createTheme } from '@gathertown/uikit-react-native-foundation';

const MyCustomDarkTheme = createTheme({
  colorScheme: 'dark',
  palette: CustomPalette,
  colors: (palette) => ({
    ...DarkUIKitTheme.colors,
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
    // ... colors
  }),
  typography: {
    shared: {
      fontFamily: 'Roboto',
    },
    h1: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 28,
    },
    // ... typography
  },
});
/** ------------------ **/
