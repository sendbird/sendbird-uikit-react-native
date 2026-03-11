import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';

import { Badge as BadgeComponent } from '@sendbird/uikit-react-native-foundation';

const meta = {
  title: 'Badge',
  component: BadgeComponent,
  argTypes: {
    maxCount: {
      name: 'Max Count',
      control: { type: 'number' },
    },
    badgeColor: {
      name: 'Badge Color',
      control: { type: 'color' },
    },
    textColor: {
      name: 'Text Color',
      control: { type: 'color' },
    },
  },
  args: {
    maxCount: 99,
    badgeColor: undefined,
    textColor: undefined,
  },
} satisfies Meta<typeof BadgeComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <>
      <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-evenly', marginBottom: 12 }}>
        <BadgeComponent {...args} count={1} />
        <BadgeComponent {...args} count={30} />
        <BadgeComponent {...args} count={60} />
        <BadgeComponent {...args} count={90} />
        <BadgeComponent {...args} count={120} />
      </View>
      <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}>
        <BadgeComponent {...args} size={'small'} count={1} />
        <BadgeComponent {...args} size={'small'} count={30} />
        <BadgeComponent {...args} size={'small'} count={60} />
        <BadgeComponent {...args} size={'small'} count={90} />
        <BadgeComponent {...args} size={'small'} count={120} />
      </View>
    </>
  ),
};
