import type React from 'react';

import type { MenuBarProps } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdGroupChannel } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export interface GroupChannelSettingsProps {
  Fragment: {
    channel: GroupChannelSettingsProps['Provider']['channel'];
    onPressHeaderLeft: GroupChannelSettingsProps['Header']['onPressHeaderLeft'];
    onPressMenuModeration: GroupChannelSettingsProps['Menu']['onPressMenuModeration'];
    onPressMenuMembers: GroupChannelSettingsProps['Menu']['onPressMenuMembers'];
    onPressMenuLeaveChannel: GroupChannelSettingsProps['Menu']['onPressMenuLeaveChannel'];
    onPressMenuNotification?: GroupChannelSettingsProps['Menu']['onPressMenuNotification'];
    menuItemsCreator?: GroupChannelSettingsProps['Menu']['menuItemsCreator'];
  };
  Header: {
    onPressHeaderLeft: () => void;
  };
  Info: {};
  Menu: {
    onPressMenuModeration: () => void;
    onPressMenuMembers: () => void;
    onPressMenuLeaveChannel: () => void;
    onPressMenuNotification?: () => void;
    menuItemsCreator?: (defaultMenuItems: MenuBarProps[]) => MenuBarProps[];
  };
  Provider: {
    channel: SendbirdGroupChannel;
  };
}

/**
 * Internal context for GroupChannelSettings
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export interface GroupChannelSettingsContextsType {
  Fragment: React.Context<{
    channel: SendbirdGroupChannel;
    headerTitle: string;
    headerRight: string;
    onPressHeaderRight: () => void;
  }>;
}
export interface GroupChannelSettingsModule {
  Provider: CommonComponent<GroupChannelSettingsProps['Provider']>;
  Header: CommonComponent<GroupChannelSettingsProps['Header']>;
  Info: CommonComponent<GroupChannelSettingsProps['Info']>;
  Menu: CommonComponent<GroupChannelSettingsProps['Menu']>;
}

export type GroupChannelSettingsFragment = CommonComponent<GroupChannelSettingsProps['Fragment']>;
