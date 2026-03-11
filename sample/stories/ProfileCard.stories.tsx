import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import { OutlinedButton, ProfileCard as ProfileCardComponent } from '@sendbird/uikit-react-native-foundation';

const meta = {
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
} satisfies Meta<typeof ProfileCardComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <ProfileCardComponent {...args} />,
};
export const WithButton: Story = {
  render: (args) => <ProfileCardComponent {...args} button={<OutlinedButton>{'Message'}</OutlinedButton>} />,
};
