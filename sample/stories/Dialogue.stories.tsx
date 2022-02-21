import type { ComponentMeta, ComponentStory } from '@storybook/react-native';
import React, { useState } from 'react';
import { Button } from 'react-native';

import { Dialogue as DialogueComponent } from '@sendbird/uikit-react-native-foundation';

const DialogueMeta: ComponentMeta<typeof DialogueComponent> = {
  title: 'Dialogue',
  component: DialogueComponent,
  argTypes: {
    title: {
      name: 'Title',
      control: { type: 'text' },
    },
    items: {
      name: 'Items',
    },
  },
  args: {
    title: 'Dialogue name',
    items: [
      {
        title: 'Loooooooooooong dialogue button title',
        onPress: () => {},
      },
      {
        title: 'Close after 3 seconds',
        onPress: () => {
          return new Promise((resolve) => {
            setTimeout(() => resolve(0), 3000);
          });
        },
      },
    ],
  },
};

export default DialogueMeta;

type DialogueStory = ComponentStory<typeof DialogueComponent>;
export const Default: DialogueStory = (args) => <WrappedDialogue {...args} />;

const WrappedDialogue: React.FC<any> = (props) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button title={'Open dialogue'} onPress={() => setVisible(true)} />
      <DialogueComponent {...props} visible={visible} onHide={() => setVisible(false)} />
    </>
  );
};
