import type React from 'react';

// @ts-ignore - !!REMOVE
import type { BaseHeaderProps, CommonComponent } from '../../types';

/** Specific props type for creating fragment header **/
type FragmentHeaderProps = BaseHeaderProps<{ title: string; left: React.ReactElement; onPressLeft: () => void }>;
export type __domain__Props = {
  View: {
    domainViewProp?: string;
  };
  Fragment: {
    Header?: null | ((props: FragmentHeaderProps) => null | JSX.Element);
    onPressHeaderLeft?: () => void;
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
  View: CommonComponent<__domain__Props['View']>;
}

export type __domain__Fragment = React.FC<__domain__Props['Fragment']>;
