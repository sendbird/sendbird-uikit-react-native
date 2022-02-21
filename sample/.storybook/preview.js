import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import React from 'react';
import { View } from 'react-native';

import { Palette } from '@sendbird/uikit-react-native-foundation';

export const decorators = [
  (story) => {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>{story()}</View>;
  },
  withBackgrounds,
];
export const parameters = {
  backgrounds: [
    { name: 'light', value: Palette.background50, default: true },
    { name: 'dark', value: Palette.background600 },
  ],
  layout: 'fullscreen',
  options: {
    storySort: {
      order: ['SendbirdBase', 'GroupChannel'],
    },
  },
};
