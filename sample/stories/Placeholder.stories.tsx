import type { ComponentMeta, ComponentStory } from '@storybook/react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { TypedPlaceholder as TypedPlaceholderComponent } from '@sendbird/uikit-react-native';
import { Placeholder as PlaceholderComponent } from '@sendbird/uikit-react-native-foundation';

const PlaceholderMeta: ComponentMeta<typeof PlaceholderComponent> = {
  title: 'Placeholder',
  component: PlaceholderComponent,
  argTypes: {},
  args: {},
};

export default PlaceholderMeta;

type PlaceholderStory = ComponentStory<typeof PlaceholderComponent>;
export const Placeholder: PlaceholderStory = () => (
  <View style={{ flex: 1, height: '100%', justifyContent: 'space-evenly', alignItems: 'center' }}>
    <PlaceholderComponent icon={'document'} message={'Default place holder'} />
  </View>
);

export const TypedPlaceholder: PlaceholderStory = () => (
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
);
