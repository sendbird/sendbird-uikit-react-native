import type React from 'react';

// @ts-ignore - !!REMOVE
import type { BaseHeaderProps, CommonComponent, DomainFragmentProps } from '../../types';

export type __domain__Props = {
  Header: BaseHeaderProps;
  View: {};
  Fragment: DomainFragmentProps<__domain__Props>;
};

export interface __domain__Module {
  Header: CommonComponent<__domain__Props['Header']>;
  View: CommonComponent<__domain__Props['View']>;
}

export type __domain__Fragment = React.FC<__domain__Props['Fragment']> & __domain__Module;
