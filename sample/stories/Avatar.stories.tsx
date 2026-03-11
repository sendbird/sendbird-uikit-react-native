import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useMemo } from 'react';

import { Avatar as AvatarComponent, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { getMockImage } from './constant';

const margin = { marginBottom: 12 };

const meta = {
  title: 'Avatar',
  component: AvatarComponent,
  argTypes: {},
  args: {},
} satisfies Meta<typeof AvatarComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Avatar: Story = {
  render: () => <DefaultAvatar />,
};
export const AvatarGroup: Story = {
  render: () => <GroupedAvatar />,
};
export const AvatarStack: Story = {
  render: () => <StackedAvatar />,
};

const DefaultAvatar = () => {
  const { colors } = useUIKitTheme();

  const [img1, img2] = useMemo(() => [getMockImage(), getMockImage()], []);
  return (
    <>
      <AvatarComponent uri={img1} containerStyle={margin} />
      <AvatarComponent uri={img2} muted containerStyle={margin} />
      <AvatarComponent containerStyle={margin} />
      <AvatarComponent.Icon icon={'broadcast'} backgroundColor={colors.secondary} containerStyle={margin} />
      <AvatarComponent.Icon icon={'channels'} containerStyle={margin} />
    </>
  );
};
const GroupedAvatar = () => {
  const [img1, img2, img3] = useMemo(() => [getMockImage(), getMockImage(), getMockImage()], []);
  return (
    <>
      <AvatarComponent.Group containerStyle={margin}>
        <AvatarComponent uri={img1} />
      </AvatarComponent.Group>

      <AvatarComponent.Group containerStyle={margin}>
        <AvatarComponent uri={img1} />
        <AvatarComponent uri={img2} />
      </AvatarComponent.Group>

      <AvatarComponent.Group containerStyle={margin}>
        <AvatarComponent />
        <AvatarComponent uri={img1} />
        <AvatarComponent uri={img2} />
      </AvatarComponent.Group>

      <AvatarComponent.Group>
        <AvatarComponent />
        <AvatarComponent uri={img1} />
        <AvatarComponent muted uri={img2} />
        <AvatarComponent uri={img3} />
      </AvatarComponent.Group>
    </>
  );
};
const StackedAvatar = () => {
  const [img1, img2, img3] = useMemo(() => [getMockImage(), getMockImage(), getMockImage()], []);
  return (
    <>
      <AvatarComponent.Stack containerStyle={margin} maxAvatar={3}>
        <AvatarComponent />
        <AvatarComponent uri={img1} />
        <AvatarComponent muted uri={img3} />
        <AvatarComponent uri={img2} />
      </AvatarComponent.Stack>
    </>
  );
};
