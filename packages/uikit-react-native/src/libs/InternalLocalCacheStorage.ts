import { ASYNC_NOOP } from '@sendbird/uikit-utils';

import type { KeyValuePairGet, KeyValuePairSet, LocalCacheStorage } from '../types';

export default class InternalLocalCacheStorage implements LocalCacheStorage {
  constructor(private storage: LocalCacheStorage) {}

  getAllKeys() {
    return this.storage.getAllKeys();
  }

  getItem(key: string) {
    return this.storage.getItem(key);
  }

  removeItem(key: string) {
    return this.storage.removeItem(key);
  }

  setItem(key: string, value: string) {
    return this.storage.setItem(key, value);
  }

  async multiGet(keys: string[]) {
    if (this.storage.multiGet) {
      return this.storage.multiGet(keys);
    } else {
      return Promise.all(keys.map(async (key) => [key, await this.getItem(key)] as KeyValuePairGet));
    }
  }

  async multiRemove(keys: string[]) {
    if (this.storage.multiRemove) {
      await this.storage.multiRemove(keys);
    } else {
      await Promise.all(keys.map(async (key) => this.removeItem(key)));
    }
  }

  async multiSet(keyValuePairs: Array<KeyValuePairSet>) {
    if (this.storage.multiSet) {
      await this.storage.multiSet(keyValuePairs);
    } else {
      await Promise.all(keyValuePairs.map(([key, value]) => this.storage.setItem(key, value)));
    }
  }

  clear = ASYNC_NOOP;
  flushGetRequests = ASYNC_NOOP;
}
