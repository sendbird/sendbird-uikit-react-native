// @ts-nocheck - !!REMOVE
import type React from 'react';

import type { CommonComponent } from '../../types';

export type __domain__Props = {
  Fragment: {
    onPressHeaderLeft: __domain__Props['Header']['onPressHeaderLeft'];
  };
  Header: {
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
  Provider: CommonComponent;
  Header: CommonComponent<__domain__Props['Header']>;
  View: CommonComponent<__domain__Props['View']>;
  StatusEmpty: CommonComponent;
  StatusLoading: CommonComponent;
}

export type __domain__Fragment = React.FC<__domain__Props['Fragment']>;
