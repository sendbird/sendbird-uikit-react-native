import type { Preview } from '@storybook/react-native';
import React from 'react';
import { Appearance, View } from 'react-native';

import { Palette } from '@sendbird/uikit-react-native-foundation';

const preview: Preview = {
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    backgrounds: {
      values: [
        { name: 'light', value: Palette.background50 },
        { name: 'dark', value: Palette.background600 },
      ],
      default: Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
    },
    layout: 'fullscreen',
    options: {
      storySort: {
        order: ['SendbirdBase', 'GroupChannel'],
      },
    },
  },
};

export default preview;
