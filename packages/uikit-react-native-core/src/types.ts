import type React from 'react';

import type { OmittedValues, UnionToIntersection } from '@sendbird/uikit-utils';

export type CommonComponent<P = {}> = (props: P) => React.ReactNode;

export type DomainFragmentProps<T extends { Fragment: unknown }> = Partial<
  UnionToIntersection<OmittedValues<T, 'Fragment'>>
>;
export type BaseHeaderProps = {
  title?: ((props: { children: string }) => React.ReactNode) | string;
  left?: () => React.ReactNode;
  right?: () => React.ReactNode;
};
