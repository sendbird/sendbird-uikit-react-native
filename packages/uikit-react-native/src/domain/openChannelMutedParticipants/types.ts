import type React from 'react';

import type { SendbirdOpenChannel, SendbirdRestrictedUser } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export type OpenChannelMutedParticipantsProps = {
  Fragment: {
    channel: SendbirdOpenChannel;
    onPressHeaderLeft: OpenChannelMutedParticipantsProps['Header']['onPressHeaderLeft'];
    renderUser?: OpenChannelMutedParticipantsProps['List']['renderUser'];
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
    channel: SendbirdOpenChannel;
  };
};

/**
 * Internal context for OpenChannelMutedParticipants
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type OpenChannelMutedParticipantsContextsType = {
  Fragment: React.Context<{
    headerTitle: string;
    channel: SendbirdOpenChannel;
  }>;
};
export interface OpenChannelMutedParticipantsModule {
  Provider: CommonComponent<OpenChannelMutedParticipantsProps['Provider']>;
  Header: CommonComponent<OpenChannelMutedParticipantsProps['Header']>;
  List: CommonComponent<OpenChannelMutedParticipantsProps['List']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
  StatusError: CommonComponent<OpenChannelMutedParticipantsProps['StatusError']>;
}

export type OpenChannelMutedParticipantsFragment = CommonComponent<OpenChannelMutedParticipantsProps['Fragment']>;
