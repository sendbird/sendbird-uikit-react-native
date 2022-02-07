import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { SBText } from '@sendbird/uikit-react-native';

storiesOf('SBText', module).add('SBText', () => (
  <>
    {[
      'h1',
      'h2',
      'subtitle1',
      'subtitle2',
      'body1',
      'body2',
      'body3',
      'button',
      'caption1',
      'caption2',
      'caption3',
      'caption4',
    ].map((typo) => {
      return (
        <SBText key={typo} {...{ [typo]: true }} style={{ marginBottom: 12 }}>
          {text(typo, `${typo.toUpperCase()} Text`)}
        </SBText>
      );
    })}
  </>
));
