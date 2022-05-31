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

// TODO: Remove this after 3.1.15
declare module 'sendbird' {
  interface User {
    profileUrl: string;
  }
}
