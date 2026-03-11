import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import { Icon as IconComponent, Palette } from '@sendbird/uikit-react-native-foundation';

const meta = {
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
} satisfies Meta<typeof IconComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <IconComponent {...args} />,
};
