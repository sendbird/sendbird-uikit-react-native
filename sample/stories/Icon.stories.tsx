import type { ComponentMeta, ComponentStory } from '@storybook/react-native';
import React from 'react';

import { Icon as IconComponent, Palette } from '@sendbird/uikit-react-native-foundation';

const IconMeta: ComponentMeta<typeof IconComponent> = {
  title: 'Icon',
  component: IconComponent,
  argTypes: {
    icon: {
      name: 'Icon',
      options: Object.keys(IconComponent.Assets),
      control: { type: 'select' },
    },
    size: {
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

export default IconMeta;

type IconStory = ComponentStory<typeof IconComponent>;
export const Default: IconStory = (args) => <IconComponent {...args} />;
