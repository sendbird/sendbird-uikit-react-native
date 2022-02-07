// if you use expo remove this line
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withKnobs } from '@storybook/addon-knobs';
import { addDecorator, configure, getStorybookUI } from '@storybook/react-native';
import type React from 'react';

import './rn-addon';

// enables knobs for all stories
addDecorator(withKnobs);

// import stories
configure(() => {
  require('./stories');
}, module);

// Refer to https://github.com/storybookjs/react-native/tree/master/app/react-native#getstorybookui-options
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({ asyncStorage: AsyncStorage }) as unknown as React.ComponentType;

export default StorybookUIRoot;
