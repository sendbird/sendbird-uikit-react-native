import type { ReactNode } from 'react';

export type CommonComponent<P = {}> = (props: P & { children?: ReactNode }) => null | JSX.Element; //ReactNode;

// TODO: Remove this after 3.1.15
declare module 'sendbird' {
  interface User {
    profileUrl: string;
  }
}
