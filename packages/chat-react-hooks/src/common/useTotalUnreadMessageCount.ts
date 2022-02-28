import { useState } from 'react';
import type Sendbird from 'sendbird';

import type { SendbirdChatSDK } from '@sendbird/uikit-utils';
import { truncatedBadgeCount, useAsyncEffect } from '@sendbird/uikit-utils';
import { useUniqId } from '@sendbird/uikit-utils';

import useUserEventHandler from '../handler/useUserEventHandler';

type Params = {
  paramCreator?: () => Sendbird.GroupChannelTotalUnreadMessageCountParams;
  maxCount?: number;
};

const HOOK_NAME = 'useTotalUnreadMessageCount';
export const useTotalUnreadMessageCount = (sdk: SendbirdChatSDK, params?: Params) => {
  const id = useUniqId(HOOK_NAME);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  useAsyncEffect(async () => {
    let param;
    if (params?.paramCreator) {
      param = params.paramCreator();
    } else {
      const params = new sdk.GroupChannelTotalUnreadMessageCountParams();
      params.superChannelFilter = 'all';
      param = params;
    }
    const unreadCount = await sdk.getTotalUnreadMessageCount(param);
    setUnreadMessageCount(unreadCount);
  }, [sdk, params?.paramCreator]);

  useUserEventHandler(
    sdk,
    HOOK_NAME + id,
    {
      onTotalUnreadMessageCountUpdated: (totalCount: number) => setUnreadMessageCount(totalCount),
    },
    [sdk],
  );

  return truncatedBadgeCount(unreadMessageCount, params?.maxCount);
};
