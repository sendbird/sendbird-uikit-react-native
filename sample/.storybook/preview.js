import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import React from 'react';
import { Appearance, View } from 'react-native';

import { Palette } from '@sendbird/uikit-react-native-foundation';

export const decorators = [
  (story) => {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>{story()}</View>;
  },
  withBackgrounds,
];
export const parameters = {
  backgrounds: [
    { name: 'light', value: Palette.background50, default: Appearance.getColorScheme() === 'light' },
    { name: 'dark', value: Palette.background600, default: Appearance.getColorScheme() === 'dark' },
  ],
  layout: 'fullscreen',
  options: {
    storySort: {
      order: ['SendbirdBase', 'GroupChannel'],
    },
  },
};
