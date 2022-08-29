import { useEffect, useLayoutEffect, useRef } from 'react';
import type Sendbird from 'sendbird';

import { Logger, SendbirdChatSDK } from '@sendbird/uikit-utils';

export const useChannelHandler = (
  sdk: SendbirdChatSDK,
  handlerId: string,
  hookHandler: Partial<Sendbird.ChannelHandler>,
) => {
  const handlerRef = useRef(hookHandler);
  useLayoutEffect(() => {
    handlerRef.current = hookHandler;
  });

  useEffect(() => {
    Logger.debug('[useChannelHandler] hook called by', handlerId);

    const handler = new sdk.ChannelHandler();
    const handlerKeys = Object.keys(handler) as (keyof typeof handler)[];
    handlerKeys.forEach((key) => {
      if (handlerRef.current[key]) {
        handler[key] = (...args: unknown[]) => {
          // @ts-ignore
          handlerRef.current[key](...args);
        };
      }
    });

    sdk.addChannelHandler(handlerId, handler);
    return () => sdk.removeChannelHandler(handlerId);
  }, [sdk, handlerId]);
};
