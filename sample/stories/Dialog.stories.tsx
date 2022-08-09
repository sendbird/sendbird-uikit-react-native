import type { ComponentMeta, ComponentStory } from '@storybook/react-native';
import React from 'react';
import { Button } from 'react-native';

import {
  DialogProvider,
  useActionMenu,
  useAlert,
  useBottomSheet,
  usePrompt,
} from '@sendbird/uikit-react-native-foundation';

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
export const Prompt: DialogStory = () => (
  <DialogProvider>
    <WrappedPrompt />
  </DialogProvider>
);
export const BottomSheet: DialogStory = () => (
  <DialogProvider>
    <WrappedBottomSheet />
  </DialogProvider>
);

const WrappedActionMenu = () => {
  const { openMenu } = useActionMenu();
  return (
    <>
      <Button
        title={'Open ActionMenu'}
        onPress={() =>
          openMenu({
            title: 'Action Menu',
            menuItems: [
              { title: 'Loooooooooooong ActionMenu button title', onPress: () => null },
              { title: 'Close', onPress: () => null },
            ],
          })
        }
      />

      <Button
        title={'Open multiple times (Queued)'}
        onPress={() =>
          openMenu({
            title: 'Action Menu Title title title title title title',
            menuItems: [
              {
                title: 'Open menu 2 times',
                onPress: () => {
                  openMenu({ title: 'Menu1', menuItems: [{ title: 'Hello' }] });
                  openMenu({ title: 'Menu2', menuItems: [{ title: 'Hello' }] });
                },
              },
              {
                title: 'Open menu 2 times after 2 sec',
                onPress: () => {
                  return new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      openMenu({ title: 'Menu1', menuItems: [{ title: 'Hello' }] });
                      openMenu({ title: 'Menu2', menuItems: [{ title: 'Hello' }] });
                    }, 2000);
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

const WrappedAlert = () => {
  const { alert } = useAlert();
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

const WrappedPrompt = () => {
  const { openPrompt } = usePrompt();
  const { alert } = useAlert();
  return (
    <>
      <Button
        title={'Open Prompt'}
        onPress={() => {
          openPrompt({
            title: 'Input your text',
            submitLabel: 'Save',
            onSubmit: (text) => {
              alert({ title: 'Received text from prompt', message: text });
            },
          });
        }}
      />
    </>
  );
};

const WrappedBottomSheet = () => {
  const { openSheet } = useBottomSheet();
  const { alert } = useAlert();
  return (
    <>
      <Button
        title={'Open BottomSheet Text only'}
        onPress={() => {
          openSheet({
            sheetItems: [
              { title: 'Title 1', onPress: () => alert({ title: 'Item 1 selected' }) },
              { title: 'Title 2', onPress: () => alert({ title: 'Item 2 selected' }) },
              { title: 'Title 3', onPress: () => alert({ title: 'Item 3 selected' }) },
            ],
          });
        }}
      />
      <Button
        title={'Open BottomSheet Text+Icon'}
        onPress={() => {
          openSheet({
            sheetItems: [
              { title: 'Camera', icon: 'camera', onPress: () => alert({ title: 'Camera selected' }) },
              { title: 'Photo', icon: 'photo', onPress: () => alert({ title: 'Photo selected' }) },
              { title: 'Document', icon: 'file-document', onPress: () => alert({ title: 'Document selected' }) },
            ],
          });
        }}
      />
    </>
  );
};
