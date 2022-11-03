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
    renderUser: (props: { user: SendbirdUser }) => React.ReactElement | null;
    onLoadNext: () => void;
    operators: SendbirdUser[];
    ListEmptyComponent?: React.ReactElement;
  };
  StatusError: {
    onPressRetry: () => void;
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
  }>;
};
export interface GroupChannelOperatorsModule {
  Provider: CommonComponent;
  Header: CommonComponent<GroupChannelOperatorsProps['Header']>;
  List: CommonComponent<GroupChannelOperatorsProps['List']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
  StatusError: CommonComponent<GroupChannelOperatorsProps['StatusError']>;
}

export type GroupChannelOperatorsFragment = CommonComponent<GroupChannelOperatorsProps['Fragment']>;
