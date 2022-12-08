import type { ErrorInfo, ReactNode } from 'react';

import type { SendbirdUser } from '@sendbird/uikit-utils';

export type KeyValuePairGet = [string, string | null];
export type KeyValuePairSet = [string, string];
export interface LocalCacheStorage {
  getAllKeys(): Promise<readonly string[] | string[]>;
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;

  multiSet?(keyValuePairs: Array<KeyValuePairSet>): Promise<void>;
  multiGet?(keys: string[]): Promise<readonly KeyValuePairGet[] | KeyValuePairGet[]>;
  multiRemove?(keys: string[]): Promise<void>;
}

export type ErrorBoundaryProps = { error: Error; errorInfo: ErrorInfo; reset: () => void };

export type CommonComponent<P = {}> = (props: P & { children?: ReactNode }) => null | JSX.Element; //ReactNode;

export type MentionedUser = {
  range: Range;
  user: SendbirdUser;
};

export type Range = {
  start: number;
  end: number;
};
