import type { ReactNode } from 'react';

export type CommonComponent<P = {}> = (props: P & { children?: ReactNode }) => null | JSX.Element; //ReactNode;
