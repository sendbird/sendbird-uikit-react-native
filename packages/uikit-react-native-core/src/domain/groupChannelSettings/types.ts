import type React from 'react';
import type Sendbird from 'sendbird';

import type { BaseHeaderProps, MenuBarProps } from '@sendbird/uikit-react-native-foundation';

import type { CommonComponent } from '../../types';

export type GroupChannelSettingsProps = {
  Fragment: {
    staleChannel: GroupChannelSettingsProps['Provider']['staleChannel'];
    Header?: GroupChannelSettingsProps['Header']['Header'];
    onPressHeaderLeft: GroupChannelSettingsProps['Header']['onPressHeaderLeft'];
    onPressMenuMembers: GroupChannelSettingsProps['Menu']['onPressMenuMembers'];
    onLeaveChannel: GroupChannelSettingsProps['Menu']['onLeaveChannel'];
    menuItemsCreator?: GroupChannelSettingsProps['Menu']['menuItemsCreator'];
  };
  Header: {
    Header?: null | CommonComponent<BaseHeaderProps<{ title: string; onPressLeft: () => void }>>;
    onPressHeaderLeft: () => void;
  };
  Info: {};
  Menu: {
    onPressMenuMembers: () => void;
    onLeaveChannel: () => void;
    menuItemsCreator?: (defaultMenuItems: MenuBarProps[]) => MenuBarProps[];
  };
  Provider: {
    staleChannel: Sendbird.GroupChannel;
  };
};

/**
 * Internal context for GroupChannelSettings
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type GroupChannelSettingsContextsType = {
  Fragment: React.Context<{
    channel: Sendbird.GroupChannel;
    headerTitle: string;
    headerRight: string;
    onPressHeaderRight: () => void;
  }>;
};
export interface GroupChannelSettingsModule {
  Provider: React.FC<GroupChannelSettingsProps['Provider']>;
  Header: CommonComponent<GroupChannelSettingsProps['Header']>;
  Info: CommonComponent<GroupChannelSettingsProps['Info']>;
  Menu: CommonComponent<GroupChannelSettingsProps['Menu']>;
}

export type GroupChannelSettingsFragment = React.FC<GroupChannelSettingsProps['Fragment']>;
