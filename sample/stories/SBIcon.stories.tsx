import type { ComponentMeta, ComponentStory } from '@storybook/react-native';
import React from 'react';

import { Palette, SBIcon as SBIconComponent } from '@sendbird/uikit-react-native';
import SBIconAssets from '@sendbird/uikit-react-native/src/assets/icon';

const SBIconMeta: ComponentMeta<typeof SBIconComponent> = {
  title: 'SBIcon',
  component: SBIconComponent,
  argTypes: {
    icon: {
      name: 'Icon',
      options: Object.keys(SBIconAssets),
      control: { type: 'select' },
    },
    sizes: {
      name: 'Size',
      control: { type: 'number' },
    },
    color: {
      name: 'Color',
      control: { type: 'color' },
    },
  },
  args: {
    icon: 'chat-filled',
    size: 24,
    color: Palette.primary300,
  },
};

export default SBIconMeta;

type SBIconStory = ComponentStory<typeof SBIconComponent>;
export const Default: SBIconStory = (args) => <SBIconComponent {...args} />;
