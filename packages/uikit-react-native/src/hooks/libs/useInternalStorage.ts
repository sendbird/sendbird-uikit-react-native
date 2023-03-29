import { useMemo } from 'react';

import InternalLocalCacheStorage from '../../libs/InternalLocalCacheStorage';
import type { LocalCacheStorage } from '../../types';

export const useInternalStorage = (localCacheStorage?: LocalCacheStorage) => {
  return useMemo(
    () => (localCacheStorage ? new InternalLocalCacheStorage(localCacheStorage) : undefined),
    [localCacheStorage],
  );
};
