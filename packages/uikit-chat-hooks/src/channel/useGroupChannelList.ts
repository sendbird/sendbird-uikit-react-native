import type { UseGroupChannelList } from '../types';
import { useGroupChannelListWithCollection } from './useGroupChannelListWithCollection';
import { useGroupChannelListWithQuery } from './useGroupChannelListWithQuery';

export const useGroupChannelList: UseGroupChannelList = (sdk, userId, options) => {
  if (sdk.isCacheEnabled || options?.enableCollectionWithoutLocalCache) {
    return useGroupChannelListWithCollection(sdk, userId, options);
  } else {
    return useGroupChannelListWithQuery(sdk, userId, options);
  }
};
