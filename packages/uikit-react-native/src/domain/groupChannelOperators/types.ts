import type React from 'react';

import type { SendbirdGroupChannel, SendbirdUser } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export type GroupChannelOperatorsProps = {
  Fragment: {
    channel: SendbirdGroupChannel;
    onPressHeaderLeft: GroupChannelOperatorsProps['Header']['onPressHeaderLeft'];
    onPressHeaderRight: GroupChannelOperatorsProps['Header']['onPressHeaderRight'];
    renderUser?: GroupChannelOperatorsProps['List']['renderUser'];
  };
  Header: {
    onPressHeaderLeft: () => void;
    onPressHeaderRight: () => void;
  };
  List: {
    operators: SendbirdUser[];
    onLoadNext: () => void;
    renderUser: (props: { user: SendbirdUser }) => React.ReactElement | null;
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
 * Internal context for GroupChannelOperators
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type GroupChannelOperatorsContextsType = {
  Fragment: React.Context<{
    headerTitle: string;
    channel: SendbirdGroupChannel;
  }>;
};
export interface GroupChannelOperatorsModule {
  Provider: CommonComponent<GroupChannelOperatorsProps['Provider']>;
  Header: CommonComponent<GroupChannelOperatorsProps['Header']>;
  List: CommonComponent<GroupChannelOperatorsProps['List']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
  StatusError: CommonComponent<GroupChannelOperatorsProps['StatusError']>;
}

export type GroupChannelOperatorsFragment = CommonComponent<GroupChannelOperatorsProps['Fragment']>;
