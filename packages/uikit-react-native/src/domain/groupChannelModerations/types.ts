import type React from 'react';

import type { MenuBarProps } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdGroupChannel } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export type GroupChannelModerationsProps = {
  Fragment: {
    channel: SendbirdGroupChannel;
    onPressHeaderLeft: GroupChannelModerationsProps['Header']['onPressHeaderLeft'];
    onPressMenuOperators: GroupChannelModerationsProps['Menu']['onPressMenuOperators'];
    onPressMenuMutedMembers: GroupChannelModerationsProps['Menu']['onPressMenuMutedMembers'];
    onPressMenuBannedUsers: GroupChannelModerationsProps['Menu']['onPressMenuBannedUsers'];
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
 * Internal context for GroupChannelModerations
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type GroupChannelModerationsContextsType = {
  Fragment: React.Context<{
    headerTitle: string;
    channel: SendbirdGroupChannel;
  }>;
};
export interface GroupChannelModerationsModule {
  Provider: CommonComponent<GroupChannelModerationsProps['Provider']>;
  Header: CommonComponent<GroupChannelModerationsProps['Header']>;
  Menu: CommonComponent<GroupChannelModerationsProps['Menu']>;
}

export type GroupChannelModerationsFragment = CommonComponent<GroupChannelModerationsProps['Fragment']>;
