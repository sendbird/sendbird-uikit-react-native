import { useEffect, useLayoutEffect, useRef } from 'react';

import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import { Logger, SendbirdChatSDK } from '@sendbird/uikit-utils';

export const useChannelHandler = (
  sdk: SendbirdChatSDK,
  handlerId: string,
  hookHandler: Partial<GroupChannelHandler>,
) => {
  const handlerRef = useRef(hookHandler);
  useLayoutEffect(() => {
    handlerRef.current = hookHandler;
  });

  useEffect(() => {
    Logger.debug('[useChannelHandler] hook called by', handlerId);

    const handler = new GroupChannelHandler();
    const handlerKeys = Object.keys(handler) as (keyof typeof handler)[];
    handlerKeys.forEach((key) => {
      handler[key] = (...args: unknown[]) => {
        // @ts-ignore
        handlerRef.current[key]?.(...args);
      };
    });

    sdk.groupChannel.addGroupChannelHandler(handlerId, handler);
    return () => sdk.groupChannel.removeGroupChannelHandler(handlerId);
  }, [sdk, handlerId]);
};
