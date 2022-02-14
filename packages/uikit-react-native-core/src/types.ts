import type { ReactElement } from 'react';

import type { OmittedValues, UnionToIntersection } from '@sendbird/uikit-utils';

export type CommonComponent<P = {}> = (props: P) => null | JSX.Element; //ReactNode;

export type DomainFragmentProps<T extends { Fragment: unknown }> = Partial<
  UnionToIntersection<OmittedValues<T, 'Fragment'>>
>;

type HeaderElement = string | ReactElement | null;
type HeaderPartProps = { title?: HeaderElement; right?: HeaderElement; left?: HeaderElement };
export type BaseHeaderProps<HeaderParts extends HeaderPartProps = {}, AdditionalProps = {}> = {
  titleAlign?: 'left' | 'center' | 'right';
} & HeaderParts &
  AdditionalProps;
