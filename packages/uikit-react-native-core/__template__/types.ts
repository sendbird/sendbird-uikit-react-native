import type React from 'react';

// @ts-ignore - !!REMOVE
import type { BaseHeaderProps, CommonComponent } from '../../types';

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

export type __domain__Context = {};
export interface __domain__Module {
  Context: React.Context<__domain__Context>;
  Provider: React.FC;
  View: CommonComponent<__domain__Props['View']>;
}

export type __domain__Fragment = React.FC<__domain__Props['Fragment']>;
export type __domain__HeaderProps = Pick<__domain__Props['Fragment'], 'Header' | 'onPressHeaderLeft'> & {
  Context: __domain__Module['Context'];
};
