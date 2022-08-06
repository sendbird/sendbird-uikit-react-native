import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

import { useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { findColorNameFromPalette, getContrastColor } from '../../libs/utils';

const ThemeColorsScreen = () => {
  const { colors, colorScheme, select, palette } = useUIKitTheme();

  const fontColor = select({ light: 'black', dark: 'white' });
  const bgColor = select({ light: 'white', dark: 'black' });

  const parseColors = (c: object, flavor?: string): React.ReactNode => {
    return Object.entries(c).map(([name, value]) => {
      const colorName = flavor ? `${flavor}.${name}` : name;

      if (typeof value === 'object') {
        return parseColors(value, colorName);
      }

      return (
        <View
          key={colorName}
          style={{
            backgroundColor: value,
            height: 64,
            justifyContent: 'space-between',
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}
        >
          <Text style={{ textAlign: 'left', color: getContrastColor(value) }}>{colorName}</Text>
          <Text style={{ textAlign: 'right', color: getContrastColor(value) }}>
            {`${findColorNameFromPalette(palette, value)} (${value})`}
          </Text>
        </View>
      );
    });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Text style={{ color: fontColor, backgroundColor: bgColor, textAlign: 'center', paddingVertical: 12 }}>
          {`Theme: ${colorScheme}`}
        </Text>
        {parseColors(colors)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ThemeColorsScreen;
