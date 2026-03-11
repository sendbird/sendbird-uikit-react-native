import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { TypedPlaceholder as TypedPlaceholderComponent } from '@sendbird/uikit-react-native';
import { Placeholder as PlaceholderComponent } from '@sendbird/uikit-react-native-foundation';

const meta = {
  title: 'Placeholder',
  component: PlaceholderComponent,
  argTypes: {},
  args: {},
} satisfies Meta<typeof PlaceholderComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {
  render: () => (
    <View style={{ flex: 1, height: '100%', justifyContent: 'space-evenly', alignItems: 'center' }}>
      <PlaceholderComponent icon={'document'} message={'Default placeholder'} />
    </View>
  ),
};

export const TypedPlaceholder: Story = {
  render: () => (
    <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <ScrollView horizontal>
        <TypedPlaceholderComponent type={'no-banned-users'} />
        <TypedPlaceholderComponent type={'no-channels'} />
        <TypedPlaceholderComponent type={'no-messages'} />
        <TypedPlaceholderComponent type={'no-users'} />
        <TypedPlaceholderComponent type={'no-muted-members'} />
        <TypedPlaceholderComponent type={'no-results-found'} />
        <TypedPlaceholderComponent type={'error-wrong'} />
        <TypedPlaceholderComponent type={'loading'} />
      </ScrollView>
    </View>
  ),
};
