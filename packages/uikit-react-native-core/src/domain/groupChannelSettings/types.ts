import type React from 'react';
import type Sendbird from 'sendbird';

import type { BaseHeaderProps } from '@sendbird/uikit-react-native-foundation';

import type { CommonComponent } from '../../types';

export type GroupChannelSettingsProps = {
  Fragment: {
    staleChannel: GroupChannelSettingsProps['Provider']['staleChannel'];
    Header?: GroupChannelSettingsProps['Header']['Header'];
    onPressHeaderLeft: GroupChannelSettingsProps['Header']['onPressHeaderLeft'];
    onPressMenuMembers: GroupChannelSettingsProps['View']['onPressMenuMembers'];
    onLeaveChannel: GroupChannelSettingsProps['View']['onLeaveChannel'];
  };
  Header: {
    Header?: null | CommonComponent<BaseHeaderProps<{ title: string; onPressLeft: () => void }>>;
    onPressHeaderLeft: () => void;
  };
  View: {
    onPressMenuMembers: () => void;
    onLeaveChannel: () => void;
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
export type GroupChannelSettingsContextType = {
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
  View: CommonComponent<GroupChannelSettingsProps['View']>;
}

export type GroupChannelSettingsFragment = React.FC<GroupChannelSettingsProps['Fragment']>;
