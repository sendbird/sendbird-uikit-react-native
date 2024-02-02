import type React from 'react';

import type { UseUserListOptions } from '@sendbird/uikit-chat-hooks';
import type { SendbirdOpenChannel, SendbirdRestrictedUser } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export type OpenChannelBannedUsersProps = {
  Fragment: {
    channel: SendbirdOpenChannel;
    onPressHeaderLeft: OpenChannelBannedUsersProps['Header']['onPressHeaderLeft'];
    renderUser?: OpenChannelBannedUsersProps['List']['renderUser'];
    queryCreator?: UseUserListOptions<SendbirdRestrictedUser>['queryCreator'];
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
    channel: SendbirdOpenChannel;
  };
};

/**
 * Internal context for OpenChannelBannedUsers
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type OpenChannelBannedUsersContextsType = {
  Fragment: React.Context<{
    headerTitle: string;
    channel: SendbirdOpenChannel;
  }>;
};
export interface OpenChannelBannedUsersModule {
  Provider: CommonComponent<OpenChannelBannedUsersProps['Provider']>;
  Header: CommonComponent<OpenChannelBannedUsersProps['Header']>;
  List: CommonComponent<OpenChannelBannedUsersProps['List']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
  StatusError: CommonComponent<OpenChannelBannedUsersProps['StatusError']>;
}

export type OpenChannelBannedUsersFragment = React.FC<OpenChannelBannedUsersProps['Fragment']>;
