/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactElement, ReactNode } from 'react';

import type { OmittedValues, UnionToIntersection } from '@sendbird/uikit-utils';

export type CommonComponent<P = {}> = (props: P & { children?: ReactNode }) => null | JSX.Element; //ReactNode;

export type DomainFragmentProps<T extends { Fragment: unknown }> = Partial<
  UnionToIntersection<OmittedValues<T, 'Fragment'>>
>;

type HeaderElement = string | ReactElement | null;
type HeaderPartProps = {
  title?: HeaderElement;
  right?: HeaderElement;
  left?: HeaderElement;
  onPressLeft?: (...params: any[]) => any;
  onPressRight?: (...params: any[]) => any;
  children?: ReactNode;
};
export type BaseHeaderProps<HeaderParts extends HeaderPartProps = {}, AdditionalProps = {}> = {
  titleAlign?: 'left' | 'center' | 'right';
} & HeaderParts &
  AdditionalProps;
