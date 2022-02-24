import type { ComponentMeta, ComponentStory } from '@storybook/react-native';
import React from 'react';

import { Avatar as AvatarComponent, useUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { getMockImage } from './constant';

const AvatarMeta: ComponentMeta<typeof AvatarComponent> = {
  title: 'Avatar',
  component: AvatarComponent,
  argTypes: {},
  args: {},
};

export default AvatarMeta;

type AvatarStory = ComponentStory<typeof AvatarComponent>;
export const Avatar: AvatarStory = () => <DefaultAvatar />;
export const AvatarGroup: AvatarStory = () => <GroupedAvatar />;

const margin = { marginBottom: 12 };

const DefaultAvatar: React.FC = () => {
  const { colors } = useUIKitTheme();

  return (
    <>
      <AvatarComponent uri={getMockImage()} containerStyle={margin} />
      <AvatarComponent uri={getMockImage()} muted containerStyle={margin} />
      <AvatarComponent containerStyle={margin} />
      <AvatarComponent.Icon icon={'broadcast'} backgroundColor={colors.secondary} containerStyle={margin} />
      <AvatarComponent.Icon icon={'channels'} containerStyle={margin} />
    </>
  );
};
const GroupedAvatar: React.FC = () => {
  return (
    <>
      <AvatarComponent.Group containerStyle={margin}>
        <AvatarComponent uri={getMockImage()} />
      </AvatarComponent.Group>

      <AvatarComponent.Group containerStyle={margin}>
        <AvatarComponent uri={getMockImage()} />
        <AvatarComponent uri={getMockImage()} />
      </AvatarComponent.Group>

      <AvatarComponent.Group containerStyle={margin}>
        <AvatarComponent />
        <AvatarComponent uri={getMockImage()} />
        <AvatarComponent uri={getMockImage()} />
      </AvatarComponent.Group>

      <AvatarComponent.Group>
        <AvatarComponent />
        <AvatarComponent uri={getMockImage()} />
        <AvatarComponent muted uri={getMockImage()} />
        <AvatarComponent uri={getMockImage()} />
      </AvatarComponent.Group>
    </>
  );
};
