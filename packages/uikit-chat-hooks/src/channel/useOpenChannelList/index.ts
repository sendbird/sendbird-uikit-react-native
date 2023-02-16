import type { UseOpenChannelList } from '../../types';
import { useOpenChannelListWithQuery } from './useOpenChannelListWithQuery';

export const useOpenChannelList: UseOpenChannelList = (sdk, userId, options) => {
  return useOpenChannelListWithQuery(sdk, userId, options);
};
