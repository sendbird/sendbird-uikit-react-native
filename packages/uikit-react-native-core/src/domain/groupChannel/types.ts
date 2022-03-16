import type React from 'react';
import type Sendbird from 'sendbird';

import type { BaseHeaderProps } from '@sendbird/uikit-react-native-foundation';

import type { CommonComponent } from '../../types';

export type GroupChannelProps = {
  Fragment: {
    Header?: GroupChannelProps['Header']['Header'];
    onPressHeaderLeft: GroupChannelProps['Header']['onPressHeaderLeft'];
    channel: Sendbird.GroupChannel;
  };
  Header: {
    Header?: null | CommonComponent<
      BaseHeaderProps<{
        title: React.ReactElement;
        left: React.ReactElement;
        onPressLeft: () => void;
      }>
    >;
    onPressHeaderLeft: () => void;
  };
  View: {
    domainViewProp?: string;
  };
};

/**
 * Internal context for GroupChannel
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type GroupChannelContextType = {
  Fragment: React.Context<{
    headerTitle: string;
    channel: Sendbird.GroupChannel;
  }>;
};
export interface GroupChannelModule {
  Provider: React.FC<{ channel: Sendbird.GroupChannel }>;
  Header: CommonComponent<GroupChannelProps['Header']>;
  View: CommonComponent<GroupChannelProps['View']>;
}

export type GroupChannelFragment = React.FC<GroupChannelProps['Fragment']>;
