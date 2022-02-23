import type Sendbird from 'sendbird';

import type { SendbirdChatSDK } from '@sendbird/uikit-utils';

import type { UseGroupChannelMessages, UseGroupChannelMessagesOptions } from '../types';
import { useGroupChannelMessagesWithCollection } from './useGroupChannelMessagesWithCollection';
import { useGroupChannelMessagesWithQuery } from './useGroupChannelMessagesWithQuery';

export const useGroupChannelMessages = (
  sdk: SendbirdChatSDK,
  channel: Sendbird.GroupChannel,
  userId?: string,
  options?: UseGroupChannelMessagesOptions,
): UseGroupChannelMessages => {
  if (sdk.isCacheEnabled) {
    return useGroupChannelMessagesWithCollection(sdk, channel, userId, options);
  } else {
    return useGroupChannelMessagesWithQuery(sdk, channel, userId, options);
  }
};
