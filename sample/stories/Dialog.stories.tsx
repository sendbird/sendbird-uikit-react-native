import type { ComponentMeta, ComponentStory } from '@storybook/react-native';
import React from 'react';
import { Button } from 'react-native';

import { DialogProvider, useDialog } from '@sendbird/uikit-react-native-foundation';

import { loremIpsum } from './constant';

const DialogMeta: ComponentMeta<typeof DialogProvider> = {
  title: 'Dialog',
  component: DialogProvider,
  argTypes: {},
  args: {},
};
export default DialogMeta;

type DialogStory = ComponentStory<typeof DialogProvider>;
export const ActionMenu: DialogStory = () => (
  <DialogProvider>
    <WrappedActionMenu />
  </DialogProvider>
);
export const Alert: DialogStory = () => (
  <DialogProvider>
    <WrappedAlert />
  </DialogProvider>
);

const WrappedActionMenu: React.FC = () => {
  const { openMenu } = useDialog();
  return (
    <>
      <Button
        title={'Open ActionMenu'}
        onPress={() =>
          openMenu({
            title: 'Action Menu',
            items: [
              { title: 'Loooooooooooong ActionMenu button title', onPress: () => {} },
              {
                title: 'Close after 3 seconds',
                onPress: () => {
                  return new Promise((resolve) => {
                    setTimeout(() => resolve(0), 3000);
                  });
                },
              },
            ],
          })
        }
      />

      <Button
        title={'Open multiple times (Queued)'}
        onPress={() =>
          openMenu({
            title: 'Action Menu',
            items: [
              {
                title: 'Open menu 2 times',
                onPress: () => {
                  openMenu({ title: 'Menu1', items: [{ title: 'Hello' }] });
                  openMenu({ title: 'Menu2', items: [{ title: 'Hello' }] });
                },
              },
              {
                title: 'Open menu 3 times after 1 sec',
                onPress: () => {
                  return new Promise((resolve) => {
                    setTimeout(() => {
                      resolve(0);
                      openMenu({ title: 'Menu1', items: [{ title: 'Hello' }] });
                      openMenu({ title: 'Menu2', items: [{ title: 'Hello' }] });
                      openMenu({ title: 'Menu3', items: [{ title: 'Hello' }] });
                    }, 1000);
                  });
                },
              },
            ],
          })
        }
      />
    </>
  );
};

const WrappedAlert: React.FC = () => {
  const { alert } = useDialog();
  return (
    <>
      <Button title={'Open title only'} onPress={() => alert({ title: 'Title only' })} />
      <Button title={'Open long-title only'} onPress={() => alert({ title: 'Looooooooooooooooooooong title' })} />
      <Button
        title={'Open title + message'}
        onPress={() => alert({ title: 'Title', message: 'Message text is here.' })}
      />
      <Button title={'Open title + long-message'} onPress={() => alert({ title: 'Title', message: loremIpsum })} />
      <Button title={'Open message-only'} onPress={() => alert({ message: loremIpsum })} />

      <Button
        title={'Open no buttons'}
        onPress={() =>
          alert({
            title: 'Title',
            message: loremIpsum,
            buttons: [],
          })
        }
      />
      <Button
        title={'Open multiple buttons'}
        onPress={() => {
          alert({
            title: 'Title',
            message: loremIpsum,
            buttons: [{ text: 'Edit' }, { text: 'Send' }, { text: 'Cancel', style: 'destructive' }],
          });
        }}
      />

      <Button
        title={'Open multiple times (Queued)'}
        onPress={() => {
          alert({
            title: 'Title',
            message: loremIpsum,
            buttons: [
              {
                text: 'open 3 alert',
                style: 'destructive',
                onPress: () => {
                  alert({ title: 'Alert1' });
                  alert({ title: 'Alert2' });
                  alert({ title: 'Alert3' });
                },
              },
            ],
          });
        }}
      />
    </>
  );
};
