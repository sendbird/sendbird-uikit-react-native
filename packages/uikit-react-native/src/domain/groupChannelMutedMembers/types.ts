import type React from 'react';

import type { SendbirdGroupChannel, SendbirdMember } from '@sendbird/uikit-utils';

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
    renderUser: (props: { user: SendbirdMember }) => React.ReactElement | null;
    mutedMembers: SendbirdMember[];
    ListEmptyComponent?: React.ReactElement;
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
  }>;
};
export interface GroupChannelMutedMembersModule {
  Provider: CommonComponent;
  Header: CommonComponent<GroupChannelMutedMembersProps['Header']>;
  List: CommonComponent<GroupChannelMutedMembersProps['List']>;
  StatusEmpty: CommonComponent;
}

export type GroupChannelMutedMembersFragment = CommonComponent<GroupChannelMutedMembersProps['Fragment']>;
