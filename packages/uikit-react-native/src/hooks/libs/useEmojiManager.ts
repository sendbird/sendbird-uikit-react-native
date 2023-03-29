import { useMemo } from 'react';

import EmojiManager from '../../libs/EmojiManager';
import type InternalLocalCacheStorage from '../../libs/InternalLocalCacheStorage';

export const useEmojiManager = (internalStorage?: InternalLocalCacheStorage) => {
  return useMemo(() => new EmojiManager(internalStorage), [internalStorage]);
};
