import type { SendbirdChatSDK, SendbirdGroupChannel } from '@sendbird/uikit-utils';

import type { UseGroupChannelMessages, UseGroupChannelMessagesOptions } from '../../types';
import { useGroupChannelMessagesWithCollection } from './useGroupChannelMessagesWithCollection';
import { useGroupChannelMessagesWithQuery } from './useGroupChannelMessagesWithQuery';

export const useGroupChannelMessages = (
  sdk: SendbirdChatSDK,
  staleChannel: SendbirdGroupChannel,
  userId?: string,
  options?: UseGroupChannelMessagesOptions,
): UseGroupChannelMessages => {
  if (sdk.isCacheEnabled || options?.enableCollectionWithoutLocalCache) {
    return useGroupChannelMessagesWithCollection(sdk, staleChannel, userId, options);
  } else {
    return useGroupChannelMessagesWithQuery(sdk, staleChannel, userId, options);
  }
};
