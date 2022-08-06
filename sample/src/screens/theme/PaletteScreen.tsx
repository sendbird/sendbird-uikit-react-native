import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

import { useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { getContrastColor } from '../../libs/utils';

const PaletteScreen = () => {
  const { palette } = useUIKitTheme();
  return (
    <SafeAreaView>
      <ScrollView>
        {Object.entries(palette).map(([name, value]) => {
          const color = getContrastColor(value);
          return (
            <View
              key={name}
              style={{
                backgroundColor: value,
                height: 64,
                justifyContent: 'space-between',
                paddingVertical: 12,
                paddingHorizontal: 16,
              }}
            >
              <Text style={{ textAlign: 'left', color }}>{name}</Text>
              <Text style={{ textAlign: 'right', color }}>{value}</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaletteScreen;
