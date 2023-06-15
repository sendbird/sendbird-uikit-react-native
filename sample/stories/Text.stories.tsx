import type { ComponentMeta, ComponentStory } from '@storybook/react-native';
import React from 'react';

import { Text as TextComponent } from '@sendbird/uikit-react-native-foundation';

const TextMeta: ComponentMeta<typeof TextComponent> = {
  title: 'Text',
  component: TextComponent,
  argTypes: {
    children: {
      name: 'Text',
      control: { type: 'text' },
    },
  },
  args: {
    children: 'Text',
  },
};

export default TextMeta;

type TextStory = ComponentStory<typeof TextComponent>;
export const Default: TextStory = (args) => (
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
        <TextComponent key={typo} {...{ [typo]: true }} style={{ marginBottom: 12 }}>
          {`${typo.toUpperCase()}-${args.children}`}
        </TextComponent>
      );
    })}
  </>
);
