import type Sendbird from 'sendbird';

import type { UseGroupChannelListOptions } from '../types';
import { useGroupChannelListWithCollection } from './useGroupChannelListWithCollection';
import { useGroupChannelListWithQuery } from './useGroupChannelListWithQuery';

export const useGroupChannelList = (
  sdk: Sendbird.SendBirdInstance,
  userId?: string,
  options?: UseGroupChannelListOptions,
) => {
  if (sdk.isCacheEnabled) {
    return useGroupChannelListWithQuery(sdk, userId, options);
  } else {
    return useGroupChannelListWithCollection(sdk, userId, options);
  }
};
