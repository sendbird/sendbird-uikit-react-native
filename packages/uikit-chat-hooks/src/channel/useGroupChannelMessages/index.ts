import { Logger } from '@sendbird/uikit-utils';

import type { UseGroupChannelMessages } from '../../types';
import { useGroupChannelMessagesWithCollection } from './useGroupChannelMessagesWithCollection';
import { useGroupChannelMessagesWithQuery } from './useGroupChannelMessagesWithQuery';

/**
 * @deprecated This hook is deprecated and will be replaced by the '@sendbird/uikit-tools' package.
 * */
export const useGroupChannelMessages: UseGroupChannelMessages = (sdk, channel, userId, options) => {
  if (sdk.isCacheEnabled || options?.enableCollectionWithoutLocalCache) {
    if (options?.queryCreator) printIgnoredWarning();
    return useGroupChannelMessagesWithCollection(sdk, channel, userId, options);
  } else {
    return useGroupChannelMessagesWithQuery(sdk, channel, userId, options);
  }
};

const printIgnoredWarning = () => {
  Logger.warn(
    'If sdk.isCacheEnabled or enableCollectionWithoutLocalCache is turned on, queryCreator is ignored' +
      'Please use collectionCreator instead.',
  );
};
