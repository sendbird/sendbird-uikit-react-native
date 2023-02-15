import { useState } from 'react';

import type { SendbirdChatSDK } from '@sendbird/uikit-utils';
import { truncatedCount, useAsyncEffect, useUniqHandlerId } from '@sendbird/uikit-utils';

import { useUserEventHandler } from '../handler/useUserEventHandler';

type Params = {
  maxCount?: number;
};
export const useTotalUnreadChannelCount = (sdk: SendbirdChatSDK, params?: Params) => {
  const handlerId = useUniqHandlerId('useTotalUnreadChannelCount');
  const [unreadChannelCount, setUnreadChannelCount] = useState(0);

  useAsyncEffect(async () => {
    setUnreadChannelCount(await sdk.groupChannel.getTotalUnreadChannelCount());
  }, [sdk]);

  useUserEventHandler(sdk, handlerId, {
    onTotalUnreadMessageCountUpdated: async () => {
      setUnreadChannelCount(await sdk.groupChannel.getTotalUnreadChannelCount());
    },
  });

  return truncatedCount(unreadChannelCount, params?.maxCount);
};
