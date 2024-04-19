import React from 'react';
import { Text, createTheme } from '@gathertown/uikit-react-native-foundation';

/**
 * Text component
 * {@link https://sendbird.com/docs/uikit/v3/react-native/resources/typography-resource#2-how-to-use-3-text-component}
 * */
const TextList = () => {
  return (
    <>
      <Text h1>{'h1'}</Text>
      <Text h2>{'h2'}</Text>
      <Text caption1>{'caption1'}</Text>
      <Text caption2>{'caption2'}</Text>
      <Text caption3>{'caption3'}</Text>
      <Text caption4>{'caption4'}</Text>
    </>
  );
};
/** ------------------ **/

/**
 * Typography property
 * {@link https://sendbird.com/docs/uikit/v3/react-native/resources/typography-resource#2-how-to-use-3-typography-property}
 * */
import { useUIKitTheme } from '@gathertown/uikit-react-native-foundation';
// import { Text } from 'react-native';

const Component = () => {
  const { typography } = useUIKitTheme();

  return <Text style={typography.h1}>{'Text'}</Text>;
};
/** ------------------ **/

/**
 * Customize with default themes
 * {@link https://sendbird.com/docs/uikit/v3/react-native/resources/typography-resource#2-customize-the-typography-3-customize-with-default-themes}
 * */
import { LightUIKitTheme, createTypography } from '@gathertown/uikit-react-native-foundation';

// Override typography.
LightUIKitTheme.typography = createTypography({
  // Apply to h1 typography.
  h1: {
    fontSize: 24,
    lineHeight: 26,
  },
  // Apply to h2 typography.
  h2: {
    fontSize: 20,
    lineHeight: 24,
  },
  // Apply to all typographies.
  shared: {
    fontFamily: 'Roboto',
  },
});

// Clear h1 typography.
LightUIKitTheme.typography.h1 = {};
/** ------------------ **/

/**
 * Customize with createTheme()
 * {@link https://sendbird.com/docs/uikit/v3/react-native/resources/typography-resource#2-customize-the-typography-3-customize-with-createtheme-}
 * */
// import { createTheme, LightUIKitTheme } from '@gathertown/uikit-react-native-foundation';

const CustomTheme = createTheme({
  colorScheme: 'light',
  colors: () => LightUIKitTheme.colors,
  typography: {
    h1: {
      fontSize: 24,
      lineHeight: 26,
    },
    h2: {
      fontSize: 20,
      lineHeight: 24,
    },
    shared: {
      fontFamily: 'Roboto',
    },
  },
});
/** ------------------ **/
