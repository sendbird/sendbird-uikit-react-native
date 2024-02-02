import type React from 'react';

import type { MenuBarProps } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdOpenChannel } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export type OpenChannelSettingsProps = {
  Fragment: {
    channel: OpenChannelSettingsProps['Provider']['channel'];
    onPressHeaderLeft: OpenChannelSettingsProps['Header']['onPressHeaderLeft'];
    onPressMenuModeration: OpenChannelSettingsProps['Menu']['onPressMenuModeration'];
    onPressMenuParticipants: OpenChannelSettingsProps['Menu']['onPressMenuParticipants'];
    onPressMenuDeleteChannel: OpenChannelSettingsProps['Menu']['onPressMenuDeleteChannel'];
    onNavigateToOpenChannel: OpenChannelSettingsProps['Provider']['onNavigateToOpenChannel'];
    menuItemsCreator?: OpenChannelSettingsProps['Menu']['menuItemsCreator'];
  };
  Header: {
    onPressHeaderLeft: () => void;
  };
  Info: {};
  Menu: {
    onPressMenuModeration: () => void;
    onPressMenuParticipants: () => void;
    onPressMenuDeleteChannel: () => void;
    menuItemsCreator?: (defaultMenuItems: MenuBarProps[]) => MenuBarProps[];
  };
  Provider: {
    channel: SendbirdOpenChannel;
    onNavigateToOpenChannel: () => void;
  };
};

/**
 * Internal context for OpenChannelSettings
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type OpenChannelSettingsContextsType = {
  Fragment: React.Context<{
    channel: SendbirdOpenChannel;
    headerTitle: string;
    headerRight: string;
    onPressHeaderRight: () => void;
  }>;
};
export interface OpenChannelSettingsModule {
  Provider: CommonComponent<OpenChannelSettingsProps['Provider']>;
  Header: CommonComponent<OpenChannelSettingsProps['Header']>;
  Info: CommonComponent<OpenChannelSettingsProps['Info']>;
  Menu: CommonComponent<OpenChannelSettingsProps['Menu']>;
}

export type OpenChannelSettingsFragment = React.FC<OpenChannelSettingsProps['Fragment']>;
