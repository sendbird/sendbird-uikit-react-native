import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';

import { Button as ButtonComponent } from '@sendbird/uikit-react-native-foundation';

const meta = {
  title: 'Button',
  component: ButtonComponent,
  argTypes: {},
  args: {},
} satisfies Meta<typeof ButtonComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <View style={{ flex: 1, height: '100%', justifyContent: 'space-evenly', alignItems: 'center' }}>
      <ButtonComponent variant={'contained'}>{'Contained'}</ButtonComponent>
      <ButtonComponent variant={'contained'} disabled>
        {'Contained'}
      </ButtonComponent>

      <ButtonComponent icon={'refresh'} variant={'contained'}>
        {'Icon+Contained'}
      </ButtonComponent>
      <ButtonComponent icon={'refresh'} variant={'contained'} disabled>
        {'Icon+Contained'}
      </ButtonComponent>
      <ButtonComponent variant={'text'}>{'Text'}</ButtonComponent>
      <ButtonComponent variant={'text'} disabled>
        {'Text'}
      </ButtonComponent>

      <ButtonComponent icon={'refresh'} variant={'text'}>
        {'Icon+Text'}
      </ButtonComponent>
      <ButtonComponent icon={'refresh'} variant={'text'} disabled>
        {'Icon+Text'}
      </ButtonComponent>
    </View>
  ),
};
