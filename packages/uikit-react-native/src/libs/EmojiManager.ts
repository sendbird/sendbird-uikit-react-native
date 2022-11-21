import type { Emoji, EmojiCategory, EmojiContainer } from '@sendbird/chat';
import type { LocalCacheStorage } from '@sendbird/uikit-react-native';

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

  public emojiCategoryMap: Record<string, EmojiCategory> = {};
  public allEmojiMap: Record<string, Emoji> = {};
  private emojiStorage = {
    timeout: undefined as undefined | NodeJS.Timeout,
    data: null as null | EmojiContainer,
    get: async () => {
      if (!this.emojiStorage.data) {
        const strItem = await this.internalStorage.getItem(EmojiManager.key);
        if (strItem) this.emojiStorage.data = JSON.parse(strItem);
      }
      return this.emojiStorage.data;
    },
    set: async (data: EmojiContainer, noThrottle = false) => {
      this.emojiStorage.data = data;

      if (noThrottle) {
        this.emojiStorage.timeout = undefined;
        await this.internalStorage.setItem(EmojiManager.key, JSON.stringify(data));
      } else {
        if (this.emojiStorage.timeout) clearTimeout(this.emojiStorage.timeout);
        this.emojiStorage.timeout = setTimeout(() => {
          this.emojiStorage.timeout = undefined;
          this.internalStorage.setItem(EmojiManager.key, JSON.stringify(data));
        }, 1000);
      }
    },
  };

  init = async (emojiContainer?: EmojiContainer) => {
    if (emojiContainer) await this.emojiStorage.set(emojiContainer, true);

    const container = await this.emojiStorage.get();

    if (container) {
      for (const category of container.emojiCategories) {
        this.emojiCategoryMap[category.id] = category;
        for (const emoji of category.emojis) {
          this.allEmojiMap[emoji.key] = emoji;
        }
      }
    }
  };
}

export default EmojiManager;
