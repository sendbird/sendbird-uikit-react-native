import type { ComponentMeta, ComponentStory } from '@storybook/react-native';
import React, { useMemo } from 'react';

import { Avatar as AvatarComponent, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { getMockImage } from './constant';

const margin = { marginBottom: 12 };

type AvatarStory = ComponentStory<typeof AvatarComponent>;
const AvatarMeta: ComponentMeta<typeof AvatarComponent> = {
  title: 'Avatar',
  component: AvatarComponent,
  argTypes: {},
  args: {},
};

export default AvatarMeta;

export const Avatar: AvatarStory = () => <DefaultAvatar />;
export const AvatarGroup: AvatarStory = () => <GroupedAvatar />;
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
