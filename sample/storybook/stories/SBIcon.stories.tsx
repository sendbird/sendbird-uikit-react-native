import { color, number, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { Palette, SBIcon } from '@sendbird/uikit-react-native';
import SBIconAssets from '@sendbird/uikit-react-native/src/assets/icon';

storiesOf('SBIcon', module).add('SBIcon', () => (
  <SBIcon
    icon={select('Icon', Object.keys(SBIconAssets) as any, 'chat-filled')}
    size={number('Size', 24)}
    color={color('Color', Palette.primary300)}
  />
));
