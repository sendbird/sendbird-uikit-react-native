import { useEffect, useLayoutEffect, useRef } from 'react';

import { UserEventHandler } from '@sendbird/chat';
import type { SendbirdChatSDK } from '@sendbird/uikit-utils';
import { Logger } from '@sendbird/uikit-utils';

export const useUserEventHandler = (
  sdk: SendbirdChatSDK,
  handlerId: string,
  hookHandler: Partial<UserEventHandler>,
) => {
  const handlerRef = useRef(hookHandler);
  useLayoutEffect(() => {
    handlerRef.current = hookHandler;
  });

  useEffect(() => {
    Logger.debug('[useUserEventHandler] hook called by', handlerId);

    const handler = new UserEventHandler();
    const handlerKeys = Object.keys(handler) as (keyof typeof handler)[];

    handlerKeys.forEach((key) => {
      handler[key] = (...args: unknown[]) => {
        // @ts-ignore
        handlerRef.current[key]?.(...args);
      };
    });

    sdk.addUserEventHandler(handlerId, handler);
    return () => sdk.removeUserEventHandler(handlerId);
  }, [sdk, handlerId]);
};
