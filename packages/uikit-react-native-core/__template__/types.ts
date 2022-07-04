// @ts-nocheck - !!REMOVE
import type React from 'react';

import type { BaseHeaderProps } from '@sendbird/uikit-react-native-foundation';

import type { CommonComponent } from '../../types';

export type __domain__Props = {
  Fragment: {
    Header?: __domain__Props['Header']['Header'];
    onPressHeaderLeft: __domain__Props['Header']['onPressHeaderLeft'];
  };
  Header: {
    Header?: null | CommonComponent<
      BaseHeaderProps<{ title: string; left: React.ReactElement; onPressLeft: () => void }>
    >;
    onPressHeaderLeft: () => void;
  };
  View: {
    domainViewProp?: string;
  };
};

/**
 * Internal context for __domain__
 * For example, the developer can create a custom header
 * with getting data from the domain context
 * */
export type __domain__ContextsType = {
  Fragment: React.Context<{
    headerTitle: string;
  }>;
};
export interface __domain__Module {
  Provider: React.FC;
  Header: CommonComponent<__domain__Props['Header']>;
  View: CommonComponent<__domain__Props['View']>;
}

export type __domain__Fragment = React.FC<__domain__Props['Fragment']>;
