import { useEffect, useLayoutEffect, useRef } from 'react';

import { ConnectionHandler } from '@sendbird/chat';
import { Logger, SendbirdChatSDK } from '@sendbird/uikit-utils';

export const useConnectionHandler = (
  sdk: SendbirdChatSDK,
  handlerId: string,
  hookHandler: Partial<ConnectionHandler>,
) => {
  const handlerRef = useRef<Partial<ConnectionHandler>>();
  useLayoutEffect(() => {
    handlerRef.current = hookHandler;
  });

  useEffect(() => {
    Logger.info('[useConnectionHandler]', handlerId);

    const handler = new ConnectionHandler();
    const handlerKeys = Object.keys(handler) as (keyof typeof handler)[];
    handlerKeys.forEach((key) => {
      handler[key] = (...args: unknown[]) => {
        // @ts-ignore
        handlerRef.current[key]?.(...args);
      };
    });

    sdk.addConnectionHandler(handlerId, handler);
    return () => sdk.removeConnectionHandler(handlerId);
  }, [sdk, handlerId]);
};
