import type { ComponentMeta, ComponentStory } from '@storybook/react-native';
import React from 'react';

import { SBText as SBTextComponent } from '@sendbird/uikit-react-native';

const SBTextMeta: ComponentMeta<typeof SBTextComponent> = {
  title: 'SBText',
  component: SBTextComponent,
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

export default SBTextMeta;

type SBTextStory = ComponentStory<typeof SBTextComponent>;
export const Default: SBTextStory = (args) => (
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
        <SBTextComponent key={typo} {...{ [typo]: true }} style={{ marginBottom: 12 }}>
          {`${typo.toUpperCase()}-${args.children}`}
        </SBTextComponent>
      );
    })}
  </>
);
