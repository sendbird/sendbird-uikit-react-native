import type { ComponentMeta, ComponentStory } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';

import { Button as ButtonComponent } from '@sendbird/uikit-react-native-foundation';

const ButtonMeta: ComponentMeta<typeof ButtonComponent> = {
  title: 'Button',
  component: ButtonComponent,
  argTypes: {},
  args: {},
};

export default ButtonMeta;

type ButtonStory = ComponentStory<typeof ButtonComponent>;
export const Default: ButtonStory = () => (
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
);
