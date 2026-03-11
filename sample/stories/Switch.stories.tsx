import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';

import { Switch as SwitchComponent } from '@sendbird/uikit-react-native-foundation';

const meta = {
  title: 'Switch',
  component: SwitchComponent,
  argTypes: {
    thumbColor: {
      name: 'ActiveThumbColor',
      control: { type: 'color' },
    },
    inactiveThumbColor: {
      name: 'InActiveThumbColor',
      control: { type: 'color' },
    },
    trackColor: {
      name: 'ActiveTrackColor',
      control: { type: 'color' },
    },
    inactiveTrackColor: {
      name: 'InActiveTrackColor',
      control: { type: 'color' },
    },
  },
  args: {
    children: 'Switch',
  },
} satisfies Meta<typeof SwitchComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <WrappedSwitch {...args} />,
};

const WrappedSwitch = (props: object) => {
  const [value, setValue] = useState(false);
  return <SwitchComponent value={value} onChangeValue={setValue} {...props} />;
};
