import type { ComponentMeta, ComponentStory } from '@storybook/react-native';
import React from 'react';
import { Alert } from 'react-native';

import { GroupChannelPreview as GroupChannelPreviewComponent } from '@sendbird/uikit-react-native';
import SBIconAssets from '@sendbird/uikit-react-native/src/assets/icon';

const GroupChannelPreviewMeta: ComponentMeta<typeof GroupChannelPreviewComponent> = {
  title: 'GroupChannelPreview',
  component: GroupChannelPreviewComponent,
  argTypes: {
    coverUrl: {
      name: 'Cover Url',
      control: { type: 'text' },
    },
    title: {
      name: 'Title',
      control: { type: 'text' },
    },
    titleCaption: {
      name: 'Title Caption',
      control: { type: 'text' },
    },
    body: {
      name: 'Body',
      control: { type: 'text' },
    },
    bodyIcon: {
      name: 'Body Icon',
      options: Object.keys(SBIconAssets),
      control: { type: 'select' },
    },
    memberCount: {
      name: 'Member Count',
      control: { type: 'number' },
    },
    badgeCount: {
      name: 'Badge Count',
      control: { type: 'number' },
    },
    frozen: {
      name: 'Frozen',
      control: { type: 'boolean' },
    },
    muted: {
      name: 'Muted',
      control: { type: 'boolean' },
    },
  },
  args: {
    coverUrl: 'https://static.sendbird.com/sample/cover/cover_15.jpg',
    onPress: () => Alert.alert('Pressed'),
    title: 'Title',
    titleCaption: 'Title caption',
    body: 'Body',
    bodyIcon: 'file-document',
    memberCount: 10,
    badgeCount: 5,
    frozen: true,
    muted: true,
  },
};

export default GroupChannelPreviewMeta;

type GroupChannelPreviewStory = ComponentStory<typeof GroupChannelPreviewComponent>;
export const Default: GroupChannelPreviewStory = (args) => <GroupChannelPreviewComponent {...args} />;
