import type { UseGroupChannelMessages } from '../../types';
import { useGroupChannelMessagesWithCollection } from './useGroupChannelMessagesWithCollection';
import { useGroupChannelMessagesWithQuery } from './useGroupChannelMessagesWithQuery';

export const useGroupChannelMessages: UseGroupChannelMessages = (sdk, staleChannel, userId, options) => {
  if (sdk.isCacheEnabled || options?.enableCollectionWithoutLocalCache) {
    return useGroupChannelMessagesWithCollection(sdk, staleChannel, userId, options);
  } else {
    return useGroupChannelMessagesWithQuery(sdk, staleChannel, userId, options);
  }
};
