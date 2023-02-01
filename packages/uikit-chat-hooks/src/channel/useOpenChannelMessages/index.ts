import type { UseOpenChannelMessages } from '../../types';
import { useOpenChannelMessagesWithQuery } from './useOpenChannelMessagesWithQuery';

export const useOpenChannelMessages: UseOpenChannelMessages = (sdk, channel, userId, options) => {
  return useOpenChannelMessagesWithQuery(sdk, channel, userId, options);
};
