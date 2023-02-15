import { useState } from 'react';

import { SuperChannelFilter, TotalUnreadMessageCountParams } from '@sendbird/chat/groupChannel';
import type { SendbirdChatSDK } from '@sendbird/uikit-utils';
import { truncatedCount, useAsyncEffect, useUniqHandlerId } from '@sendbird/uikit-utils';

import { useUserEventHandler } from '../handler/useUserEventHandler';

type Options = {
  params?: TotalUnreadMessageCountParams;
  maxCount?: number;
};

export const useTotalUnreadMessageCount = (sdk: SendbirdChatSDK, options?: Options) => {
  const handlerId = useUniqHandlerId('useTotalUnreadMessageCount');
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  useAsyncEffect(async () => {
    const unreadCount = await sdk.groupChannel.getTotalUnreadMessageCount({
      superChannelFilter: SuperChannelFilter.ALL,
      ...options?.params,
    });
    setUnreadMessageCount(unreadCount);
  }, [sdk, options?.params?.superChannelFilter, options?.params?.channelCustomTypesFilter]);

  useUserEventHandler(sdk, handlerId, {
    onTotalUnreadMessageCountUpdated: (totalCount: number) => setUnreadMessageCount(totalCount),
  });

  return truncatedCount(unreadMessageCount, options?.maxCount);
};
