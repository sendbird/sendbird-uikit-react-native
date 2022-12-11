import type React from 'react';

import type { SendbirdGroupChannel } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export type GroupChannelNotificationsProps = {
  Fragment: {
    channel: SendbirdGroupChannel;
    onPressHeaderLeft: GroupChannelNotificationsProps['Header']['onPressHeaderLeft'];
  };
  Header: {
    onPressHeaderLeft: () => void;
  };
  View: {};
  Provider: {
    channel: SendbirdGroupChannel;
  };
};

/**
 * Internal context for GroupChannelNotifications
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type GroupChannelNotificationsContextsType = {
  Fragment: React.Context<{
    channel: SendbirdGroupChannel;
    headerTitle: string;
  }>;
};
export interface GroupChannelNotificationsModule {
  Provider: CommonComponent<GroupChannelNotificationsProps['Provider']>;
  Header: CommonComponent<GroupChannelNotificationsProps['Header']>;
  View: CommonComponent<GroupChannelNotificationsProps['View']>;
}

export type GroupChannelNotificationsFragment = CommonComponent<GroupChannelNotificationsProps['Fragment']>;
