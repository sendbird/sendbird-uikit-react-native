import { Logger } from '@sendbird/uikit-utils';

import type { UseGroupChannelMessages } from '../../types';
import { useGroupChannelMessagesWithCollection } from './useGroupChannelMessagesWithCollection';
import { useGroupChannelMessagesWithQuery } from './useGroupChannelMessagesWithQuery';

export const useGroupChannelMessages: UseGroupChannelMessages = (sdk, channel, userId, options) => {
  if (sdk.isCacheEnabled || options?.enableCollectionWithoutLocalCache) {
    if (options?.queryCreator) Logger.warn('`queryCreator` is ignored, please use `collectionCreator` instead.');
    return useGroupChannelMessagesWithCollection(sdk, channel, userId, options);
  } else {
    return useGroupChannelMessagesWithQuery(sdk, channel, userId, options);
  }
};
