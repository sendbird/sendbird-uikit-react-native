import { useState } from 'react';

import type { SendbirdChatSDK } from '@sendbird/uikit-utils';
import { truncatedCount, useAsyncEffect } from '@sendbird/uikit-utils';
import { useUniqId } from '@sendbird/uikit-utils';

import { useUserEventHandler } from '../handler/useUserEventHandler';

type Params = {
  maxCount?: number;
};
const HOOK_NAME = 'useTotalUnreadChannelCount';
export const useTotalUnreadChannelCount = (sdk: SendbirdChatSDK, params?: Params) => {
  const id = useUniqId(HOOK_NAME);
  const [unreadChannelCount, setUnreadChannelCount] = useState(0);

  useAsyncEffect(async () => {
    setUnreadChannelCount(await sdk.groupChannel.getTotalUnreadChannelCount());
  }, [sdk]);

  useUserEventHandler(sdk, HOOK_NAME + id, {
    onTotalUnreadMessageCountUpdated: async () => {
      setUnreadChannelCount(await sdk.groupChannel.getTotalUnreadChannelCount());
    },
  });

  return truncatedCount(unreadChannelCount, params?.maxCount);
};
