import type React from 'react';

import type { MenuBarProps } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdGroupChannel } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export type GroupChannelModerationProps = {
  Fragment: {
    channel: SendbirdGroupChannel;
    onPressHeaderLeft: GroupChannelModerationProps['Header']['onPressHeaderLeft'];
    onPressMenuOperators: GroupChannelModerationProps['Menu']['onPressMenuOperators'];
    onPressMenuMutedMembers: GroupChannelModerationProps['Menu']['onPressMenuMutedMembers'];
    onPressMenuBannedUsers: GroupChannelModerationProps['Menu']['onPressMenuBannedUsers'];
    menuItemsCreator?: (defaultMenuItems: MenuBarProps[]) => MenuBarProps[];
  };
  Header: {
    onPressHeaderLeft: () => void;
  };
  Menu: {
    onPressMenuOperators: () => void;
    onPressMenuMutedMembers: () => void;
    onPressMenuBannedUsers: () => void;
    menuItemsCreator?: (defaultMenuItems: MenuBarProps[]) => MenuBarProps[];
  };
  Provider: {
    channel: SendbirdGroupChannel;
  };
};

/**
 * Internal context for GroupChannelModeration
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type GroupChannelModerationContextsType = {
  Fragment: React.Context<{
    headerTitle: string;
    channel: SendbirdGroupChannel;
  }>;
};
export interface GroupChannelModerationModule {
  Provider: CommonComponent<GroupChannelModerationProps['Provider']>;
  Header: CommonComponent<GroupChannelModerationProps['Header']>;
  Menu: CommonComponent<GroupChannelModerationProps['Menu']>;
}

export type GroupChannelModerationFragment = CommonComponent<GroupChannelModerationProps['Fragment']>;
