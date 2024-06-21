import { ASYNC_NOOP } from '@sendbird/uikit-utils';

import type {
  AsyncLocalCacheStorage,
  KeyValuePairGet,
  KeyValuePairSet,
  LocalCacheStorage,
  MMKVLocalCacheStorage,
} from '../types';

export default class InternalLocalCacheStorage implements AsyncLocalCacheStorage {
  private readonly _mmkv?: MMKVLocalCacheStorage;
  private readonly _async?: AsyncLocalCacheStorage;

  constructor(storage: LocalCacheStorage) {
    if ('getString' in storage) {
      this._mmkv = storage;
    } else {
      this._async = storage;
    }
  }

  async getAllKeys() {
    if (this._mmkv) {
      return this._mmkv.getAllKeys();
    } else if (this._async) {
      return this._async.getAllKeys();
    } else {
      return [];
    }
  }

  async getItem(key: string) {
    if (this._mmkv) {
      return this._mmkv.getString(key) ?? null;
    } else if (this._async) {
      return this._async.getItem(key);
    } else {
      return null;
    }
  }

  async removeItem(key: string) {
    if (this._mmkv) {
      this._mmkv.delete(key);
    } else if (this._async) {
      return this._async.removeItem(key);
    }
  }

  async setItem(key: string, value: string) {
    if (this._mmkv) {
      this._mmkv.set(key, value);
    } else if (this._async) {
      return this._async.setItem(key, value);
    }
  }

  async multiGet(keys: string[]) {
    if (this._mmkv) {
      return Promise.all(keys.map(async (key) => [key, await this.getItem(key)] as KeyValuePairGet));
    } else if (this._async) {
      if (this._async?.multiGet) {
        return this._async.multiGet(keys);
      } else {
        return Promise.all(keys.map(async (key) => [key, await this.getItem(key)] as KeyValuePairGet));
      }
    } else {
      return [];
    }
  }

  async multiRemove(keys: string[]) {
    if (this._mmkv) {
      await Promise.all(keys.map(async (key) => this.removeItem(key)));
    } else if (this._async) {
      if (this._async?.multiRemove) {
        await this._async.multiRemove(keys);
      } else {
        await Promise.all(keys.map(async (key) => this.removeItem(key)));
      }
    }
  }

  async multiSet(keyValuePairs: Array<KeyValuePairSet>) {
    if (this._mmkv) {
      await Promise.all(keyValuePairs.map(([key, value]) => this.setItem(key, value)));
    } else if (this._async) {
      if (this._async?.multiSet) {
        await this._async.multiSet(keyValuePairs);
      } else {
        await Promise.all(keyValuePairs.map(([key, value]) => this.setItem(key, value)));
      }
    }
  }

  clear = ASYNC_NOOP;
  flushGetRequests = ASYNC_NOOP;
}
