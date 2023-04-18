import type { SendbirdEmoji, SendbirdEmojiCategory, SendbirdEmojiContainer } from '@sendbird/uikit-utils';

import type { LocalCacheStorage } from '../types';
import InternalLocalCacheStorage from './InternalLocalCacheStorage';

class MemoryStorage implements LocalCacheStorage {
  _data: Record<string, string> = {};

  async getAllKeys(): Promise<readonly string[] | string[]> {
    return Object.keys(this._data);
  }

  async getItem(key: string): Promise<string | null> {
    return this._data[key];
  }

  async removeItem(key: string): Promise<void> {
    delete this._data[key];
  }

  async setItem(key: string, value: string): Promise<void> {
    this._data[key] = value;
  }
}

class EmojiManager {
  static key = 'sendbird-uikit@emoji-manager';

  constructor(
    private internalStorage: InternalLocalCacheStorage = new InternalLocalCacheStorage(new MemoryStorage()),
  ) {}

  private emojiStorage = {
    container: null as null | SendbirdEmojiContainer,
    get: async () => {
      if (!this.emojiStorage.container) {
        const strItem = await this.internalStorage.getItem(EmojiManager.key);
        if (strItem) this.emojiStorage.container = Object.freeze(JSON.parse(strItem));
      }
      return this.emojiStorage.container;
    },
    set: async (container: SendbirdEmojiContainer) => {
      this.emojiStorage.container = Object.freeze(container);
      await this.internalStorage.setItem(EmojiManager.key, JSON.stringify(container));
    },
  };

  private _emojiCategoryMap: Record<string, SendbirdEmojiCategory> = {};
  public get emojiCategoryMap() {
    return this._emojiCategoryMap;
  }

  private _allEmojiMap: Record<string, SendbirdEmoji> = {};
  public get allEmojiMap() {
    return this._allEmojiMap;
  }

  private _allEmoji: SendbirdEmoji[] = [];
  public get allEmoji() {
    return this._allEmoji;
  }

  public init = async (emojiContainer?: SendbirdEmojiContainer) => {
    if (emojiContainer) await this.emojiStorage.set(emojiContainer);

    const container = await this.emojiStorage.get();

    if (container) {
      for (const category of container.emojiCategories) {
        this._emojiCategoryMap[category.id] = category;
        for (const emoji of category.emojis) {
          this._allEmojiMap[emoji.key] = emoji;
        }
      }
      this._allEmoji = Object.values(this._allEmojiMap);
    }
  };

  public get emojiHash() {
    return this.emojiStorage.container?.emojiHash;
  }
}

export default EmojiManager;
