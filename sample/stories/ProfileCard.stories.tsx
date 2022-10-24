import type { ComponentMeta, ComponentStory } from '@storybook/react-native';
import React from 'react';

import { OutlinedButton, ProfileCard as ProfileCardComponent } from '@sendbird/uikit-react-native-foundation';

const ProfileCardMeta: ComponentMeta<typeof ProfileCardComponent> = {
  title: 'ProfileCard',
  component: ProfileCardComponent,
  argTypes: {
    uri: {
      name: 'Profile URI',
      control: { type: 'text' },
    },
    username: {
      name: 'Username',
      control: { type: 'text' },
    },
    button: {
      name: 'Button',
      control: { type: null },
    },
    bodyLabel: {
      name: 'Body label',
      control: { type: 'text' },
    },
    body: {
      name: 'Body',
      control: { type: 'text' },
    },
  },
  args: {
    uri: 'https://static.sendbird.com/sample/cover/cover_15.jpg',
    username: 'Member name',
    bodyLabel: 'User ID',
    body: 'User1',
  },
};

export default ProfileCardMeta;

type ProfileCardStory = ComponentStory<typeof ProfileCardComponent>;
export const Default: ProfileCardStory = (args) => <ProfileCardComponent {...args} />;
export const WithButton: ProfileCardStory = (args) => (
  <ProfileCardComponent {...args} button={<OutlinedButton>{'Message'}</OutlinedButton>} />
);
