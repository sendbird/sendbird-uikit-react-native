import type { SendbirdChatSDK } from '@sendbird/uikit-utils';

import type { UseGroupChannelList, UseGroupChannelListOptions } from '../types';
import { useGroupChannelListWithCollection } from './useGroupChannelListWithCollection';
import { useGroupChannelListWithQuery } from './useGroupChannelListWithQuery';

export const useGroupChannelList = (
  sdk: SendbirdChatSDK,
  userId?: string,
  options?: UseGroupChannelListOptions,
): UseGroupChannelList => {
  if (sdk.isCacheEnabled) {
    return useGroupChannelListWithCollection(sdk, userId, options);
  } else {
    return useGroupChannelListWithQuery(sdk, userId, options);
  }
};
