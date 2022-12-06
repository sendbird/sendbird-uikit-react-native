import type React from 'react';

import type { SendbirdGroupChannel, SendbirdRestrictedUser } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export type GroupChannelBannedUsersProps = {
  Fragment: {
    channel: SendbirdGroupChannel;
    onPressHeaderLeft: GroupChannelBannedUsersProps['Header']['onPressHeaderLeft'];
    renderUser?: GroupChannelBannedUsersProps['List']['renderUser'];
  };
  Header: {
    onPressHeaderLeft: () => void;
  };
  List: {
    renderUser: (props: { user: SendbirdRestrictedUser }) => React.ReactElement | null;
    bannedUsers: SendbirdRestrictedUser[];
    ListEmptyComponent?: React.ReactElement;
    onLoadNext: () => Promise<void>;
  };
  StatusError: {
    onPressRetry: () => void;
  };
  Provider: {
    channel: SendbirdGroupChannel;
  };
};

/**
 * Internal context for GroupChannelBannedUsers
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type GroupChannelBannedUsersContextsType = {
  Fragment: React.Context<{
    headerTitle: string;
    channel: SendbirdGroupChannel;
  }>;
};
export interface GroupChannelBannedUsersModule {
  Provider: CommonComponent<GroupChannelBannedUsersProps['Provider']>;
  Header: CommonComponent<GroupChannelBannedUsersProps['Header']>;
  List: CommonComponent<GroupChannelBannedUsersProps['List']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
  StatusError: CommonComponent<GroupChannelBannedUsersProps['StatusError']>;
}

export type GroupChannelBannedUsersFragment = CommonComponent<GroupChannelBannedUsersProps['Fragment']>;
