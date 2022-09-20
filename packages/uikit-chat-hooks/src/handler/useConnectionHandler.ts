import React, { useEffect } from 'react';

import { ConnectionHandler } from '@sendbird/chat';
import { Logger, SendbirdChatSDK } from '@sendbird/uikit-utils';

export const useConnectionHandler = (
  sdk: SendbirdChatSDK,
  handlerId: string,
  hookHandler: Partial<ConnectionHandler>,
  deps: React.DependencyList = [],
) => {
  useEffect(() => {
    Logger.info('[useConnectionHandler]', handlerId);

    const handler = new ConnectionHandler();
    const handlerKeys = Object.keys(handler) as (keyof typeof handler)[];
    handlerKeys.forEach((key) => {
      // @ts-ignore
      if (hookHandler[key]) handler[key] = hookHandler[key];
    });

    sdk.addConnectionHandler(handlerId, handler);
    return () => sdk.removeConnectionHandler(handlerId);
  }, [sdk, handlerId, ...deps]);
};
