import type { ComponentType, ErrorInfo, ReactNode } from 'react';
import type { MMKV } from 'react-native-mmkv';

import type { SendbirdUser } from '@sendbird/uikit-utils';

export type LocalCacheStorage = AsyncLocalCacheStorage | MMKVLocalCacheStorage;

export type KeyValuePairGet = [string, string | null];
export type KeyValuePairSet = [string, string];
export interface AsyncLocalCacheStorage {
  getAllKeys(): Promise<readonly string[] | string[]>;
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;

  multiSet?(keyValuePairs: Array<KeyValuePairSet>): Promise<void>;
  multiGet?(keys: string[]): Promise<readonly KeyValuePairGet[] | KeyValuePairGet[]>;
  multiRemove?(keys: string[]): Promise<void>;
}

export type MMKVLocalCacheStorage = Pick<MMKV, 'getString' | 'set' | 'delete' | 'getAllKeys'>;

export type ErrorBoundaryProps = { error: Error; errorInfo: ErrorInfo; reset: () => void };

export type CommonComponent<P = {}> = ComponentType<P & { children?: ReactNode | undefined }>;

export type MentionedUser = {
  range: Range;
  user: SendbirdUser;
};

export type Range = {
  start: number;
  end: number;
};

export enum TypingIndicatorType {
  Text = 'text',
  Bubble = 'bubble',
}
