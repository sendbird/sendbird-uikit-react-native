import type React from 'react';

import type { MenuBarProps } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdOpenChannel } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export type OpenChannelModerationProps = {
  Fragment: {
    channel: SendbirdOpenChannel;
    onPressHeaderLeft: OpenChannelModerationProps['Header']['onPressHeaderLeft'];
    onPressMenuOperators: OpenChannelModerationProps['Menu']['onPressMenuOperators'];
    onPressMenuMutedParticipants: OpenChannelModerationProps['Menu']['onPressMenuMutedParticipants'];
    onPressMenuBannedUsers: OpenChannelModerationProps['Menu']['onPressMenuBannedUsers'];
    menuItemsCreator?: OpenChannelModerationProps['Menu']['menuItemsCreator'];
  };
  Header: {
    onPressHeaderLeft: () => void;
  };
  Menu: {
    onPressMenuOperators: () => void;
    onPressMenuMutedParticipants: () => void;
    onPressMenuBannedUsers: () => void;
    menuItemsCreator?: (defaultMenuItems: MenuBarProps[]) => MenuBarProps[];
  };
  Provider: {
    channel: SendbirdOpenChannel;
  };
};

/**
 * Internal context for OpenChannelModeration
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type OpenChannelModerationContextsType = {
  Fragment: React.Context<{
    headerTitle: string;
    channel: SendbirdOpenChannel;
  }>;
};
export interface OpenChannelModerationModule {
  Provider: CommonComponent<OpenChannelModerationProps['Provider']>;
  Header: CommonComponent<OpenChannelModerationProps['Header']>;
  Menu: CommonComponent<OpenChannelModerationProps['Menu']>;
}

export type OpenChannelModerationFragment = React.FC<OpenChannelModerationProps['Fragment']>;
