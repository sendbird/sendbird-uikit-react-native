import type { UseGroupChannelMessages } from '../../types';
import { useGroupChannelMessagesWithCollection } from './useGroupChannelMessagesWithCollection';
import { useGroupChannelMessagesWithQuery } from './useGroupChannelMessagesWithQuery';

export const useGroupChannelMessages: UseGroupChannelMessages = (sdk, channel, userId, options) => {
  if (sdk.isCacheEnabled || options?.enableCollectionWithoutLocalCache) {
    return useGroupChannelMessagesWithCollection(sdk, channel, userId, options);
  } else {
    return useGroupChannelMessagesWithQuery(sdk, channel, userId, options);
  }
};
