import type React from 'react';
import type Sendbird from 'sendbird';

import type { BaseHeaderProps } from '@sendbird/uikit-react-native-foundation';

import type { CommonComponent } from '../../types';

export type GroupChannelInfoProps = {
  Fragment: {
    staleChannel: GroupChannelInfoProps['Provider']['staleChannel'];
    Header?: GroupChannelInfoProps['Header']['Header'];
    onPressHeaderLeft: GroupChannelInfoProps['Header']['onPressHeaderLeft'];
    onPressMenuMembers: GroupChannelInfoProps['View']['onPressMenuMembers'];
    onLeaveChannel: GroupChannelInfoProps['View']['onLeaveChannel'];
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
 * Internal context for GroupChannelInfo
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type GroupChannelInfoContextType = {
  Fragment: React.Context<{
    channel: Sendbird.GroupChannel;
    headerTitle: string;
    headerRight: string;
    onPressHeaderRight: () => void;
  }>;
};
export interface GroupChannelInfoModule {
  Provider: React.FC<GroupChannelInfoProps['Provider']>;
  Header: CommonComponent<GroupChannelInfoProps['Header']>;
  View: CommonComponent<GroupChannelInfoProps['View']>;
}

export type GroupChannelInfoFragment = React.FC<GroupChannelInfoProps['Fragment']>;
