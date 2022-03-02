import type { ComponentMeta, ComponentStory } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';

import { Badge as BadgeComponent } from '@sendbird/uikit-react-native-foundation';

const BadgeMeta: ComponentMeta<typeof BadgeComponent> = {
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
};

export default BadgeMeta;

type BadgeStory = ComponentStory<typeof BadgeComponent>;
export const Default: BadgeStory = (args) => (
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
);
