import type React from 'react';

import type { UseUserListOptions } from '@sendbird/uikit-chat-hooks';
import type { SendbirdOpenChannel, SendbirdUser } from '@sendbird/uikit-utils';

import type { CommonComponent } from '../../types';

export type OpenChannelOperatorsProps = {
  Fragment: {
    channel: SendbirdOpenChannel;
    onPressHeaderLeft: OpenChannelOperatorsProps['Header']['onPressHeaderLeft'];
    onPressHeaderRight: OpenChannelOperatorsProps['Header']['onPressHeaderRight'];
    renderUser?: OpenChannelOperatorsProps['List']['renderUser'];
    queryCreator?: UseUserListOptions<SendbirdUser>['queryCreator'];
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
    channel: SendbirdOpenChannel;
  };
};

/**
 * Internal context for OpenChannelOperators
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type OpenChannelOperatorsContextsType = {
  Fragment: React.Context<{
    headerTitle: string;
    channel: SendbirdOpenChannel;
  }>;
};
export interface OpenChannelOperatorsModule {
  Provider: CommonComponent<OpenChannelOperatorsProps['Provider']>;
  Header: CommonComponent<OpenChannelOperatorsProps['Header']>;
  List: CommonComponent<OpenChannelOperatorsProps['List']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
  StatusError: CommonComponent<OpenChannelOperatorsProps['StatusError']>;
}

export type OpenChannelOperatorsFragment = React.FC<OpenChannelOperatorsProps['Fragment']>;
