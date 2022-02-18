import type { ReactNode } from 'react';

import type { OmittedValues, UnionToIntersection } from '@sendbird/uikit-utils';

export type CommonComponent<P = {}> = (props: P & { children?: ReactNode }) => null | JSX.Element; //ReactNode;

export type DomainFragmentProps<T extends { Fragment: unknown }> = Partial<
  UnionToIntersection<OmittedValues<T, 'Fragment'>>
>;
