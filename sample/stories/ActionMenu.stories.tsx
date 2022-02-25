import type { ComponentMeta, ComponentStory } from '@storybook/react-native';
import React, { useState } from 'react';
import { Button } from 'react-native';

import { ActionMenu as ActionMenuComponent } from '@sendbird/uikit-react-native-foundation';

const ActionMenuMeta: ComponentMeta<typeof ActionMenuComponent> = {
  title: 'ActionMenu',
  component: ActionMenuComponent,
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
    title: 'ActionMenu name',
    items: [
      {
        title: 'Loooooooooooong ActionMenu button title',
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

export default ActionMenuMeta;

type ActionMenuStory = ComponentStory<typeof ActionMenuComponent>;
export const Default: ActionMenuStory = (args) => <WrappedActionMenu {...args} />;

const WrappedActionMenu: React.FC<any> = (props) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button title={'Open ActionMenu'} onPress={() => setVisible(true)} />
      <ActionMenuComponent {...props} visible={visible} onHide={() => setVisible(false)} />
    </>
  );
};
