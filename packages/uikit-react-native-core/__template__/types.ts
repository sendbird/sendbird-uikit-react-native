// @ts-nocheck - !!REMOVE
import type React from 'react';

import type { BaseHeaderProps } from '@sendbird/uikit-react-native-foundation';

import type { CommonComponent } from '../../types';

/** Specific props type for creating header **/
type FragmentHeaderProps = BaseHeaderProps<{ title: string; left: React.ReactElement; onPressLeft: () => void }>;
export type __domain__Props = {
  Fragment: {
    Header?: null | CommonComponent<FragmentHeaderProps>;
    onPressHeaderLeft?: () => void;
  };
  Header: {
    Header?: __domain__Props['Fragment']['Header'];
    onPressHeaderLeft: __domain__Props['Fragment']['onPressHeaderLeft'];
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
export type __domain__ContextType = {
  fragment: { headerTitle: string };
};
export interface __domain__Module {
  Provider: React.FC;
  Header: CommonComponent<__domain__Props['Header']>;
  View: CommonComponent<__domain__Props['View']>;
}

export type __domain__Fragment = React.FC<__domain__Props['Fragment']>;
