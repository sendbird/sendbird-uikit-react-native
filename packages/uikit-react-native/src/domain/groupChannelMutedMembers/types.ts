import type React from 'react';

import type { SendbirdGroupChannel, SendbirdRestrictedUser } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export type GroupChannelMutedMembersProps = {
  Fragment: {
    channel: SendbirdGroupChannel;
    onPressHeaderLeft: GroupChannelMutedMembersProps['Header']['onPressHeaderLeft'];
    renderUser?: GroupChannelMutedMembersProps['List']['renderUser'];
  };
  Header: {
    onPressHeaderLeft: () => void;
  };
  List: {
    renderUser: (props: { user: SendbirdRestrictedUser }) => React.ReactElement | null;
    onLoadNext: () => void;
    mutedMembers: SendbirdRestrictedUser[];
    ListEmptyComponent?: React.ReactElement;
  };
  StatusError: {
    onPressRetry: () => void;
  };
  Provider: {
    channel: SendbirdGroupChannel;
  };
};

/**
 * Internal context for GroupChannelMutedMembers
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type GroupChannelMutedMembersContextsType = {
  Fragment: React.Context<{
    headerTitle: string;
    channel: SendbirdGroupChannel;
  }>;
};
export interface GroupChannelMutedMembersModule {
  Provider: CommonComponent<GroupChannelMutedMembersProps['Provider']>;
  Header: CommonComponent<GroupChannelMutedMembersProps['Header']>;
  List: CommonComponent<GroupChannelMutedMembersProps['List']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
  StatusError: CommonComponent<GroupChannelMutedMembersProps['StatusError']>;
}

export type GroupChannelMutedMembersFragment = CommonComponent<GroupChannelMutedMembersProps['Fragment']>;
