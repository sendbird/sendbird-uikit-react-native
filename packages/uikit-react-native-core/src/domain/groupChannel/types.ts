import type React from 'react';

import type { BaseHeaderProps } from '@sendbird/uikit-react-native-foundation';

import type { CommonComponent } from '../../types';

export type GroupChannelProps = {
  Fragment: {
    Header?: null | CommonComponent<
      BaseHeaderProps<{
        title: string;
        left: React.ReactElement;
        onPressLeft: () => void;
      }>
    >;
    onPressHeaderLeft?: () => void;
  };
  Header: {
    Header?: GroupChannelProps['Fragment']['Header'];
    onPressHeaderLeft: GroupChannelProps['Fragment']['onPressHeaderLeft'];
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
  fragment: { headerTitle: string };
};
export interface GroupChannelModule {
  Provider: React.FC;
  Header: CommonComponent<GroupChannelProps['Header']>;
  View: CommonComponent<GroupChannelProps['View']>;
}

export type GroupChannelFragment = React.FC<GroupChannelProps['Fragment']>;
