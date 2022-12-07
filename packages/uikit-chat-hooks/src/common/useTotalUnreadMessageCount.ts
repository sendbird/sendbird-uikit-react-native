import { useState } from 'react';

import { SuperChannelFilter, TotalUnreadMessageCountParams } from '@sendbird/chat/groupChannel';
import type { SendbirdChatSDK } from '@sendbird/uikit-utils';
import { truncatedCount, useAsyncEffect, useUniqId } from '@sendbird/uikit-utils';

import { useUserEventHandler } from '../handler/useUserEventHandler';

type Options = {
  params?: TotalUnreadMessageCountParams;
  maxCount?: number;
};

const HOOK_NAME = 'useTotalUnreadMessageCount';
export const useTotalUnreadMessageCount = (sdk: SendbirdChatSDK, options?: Options) => {
  const id = useUniqId(HOOK_NAME);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  useAsyncEffect(async () => {
    const unreadCount = await sdk.groupChannel.getTotalUnreadMessageCount({
      superChannelFilter: SuperChannelFilter.ALL,
      ...options?.params,
    });
    setUnreadMessageCount(unreadCount);
  }, [sdk, options?.params?.superChannelFilter, options?.params?.channelCustomTypesFilter]);

  useUserEventHandler(sdk, `${HOOK_NAME}_${id}`, {
    onTotalUnreadMessageCountUpdated: (totalCount: number) => setUnreadMessageCount(totalCount),
  });

  return truncatedCount(unreadMessageCount, options?.maxCount);
};
