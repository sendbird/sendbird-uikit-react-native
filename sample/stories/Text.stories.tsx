import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import { Text as TextComponent } from '@sendbird/uikit-react-native-foundation';

const meta = {
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
} satisfies Meta<typeof TextComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
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
  ),
};
