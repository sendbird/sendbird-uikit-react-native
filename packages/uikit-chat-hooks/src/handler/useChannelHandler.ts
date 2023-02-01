import { useEffect, useLayoutEffect, useRef } from 'react';

import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import { OpenChannelHandler } from '@sendbird/chat/openChannel';
import { Logger, SendbirdChatSDK } from '@sendbird/uikit-utils';

type ChannelType = 'open' | 'group';
export const useChannelHandler = <T extends ChannelType = 'group'>(
  sdk: SendbirdChatSDK,
  handlerId: string,
  hookHandler: Partial<T extends 'group' ? GroupChannelHandler : OpenChannelHandler>,
  type = 'group' as T,
) => {
  const handlerRef = useRef(hookHandler);
  useLayoutEffect(() => {
    handlerRef.current = hookHandler;
  });

  useEffect(() => {
    Logger.debug('[useChannelHandler] hook called by', handlerId);

    const handler = type === 'open' ? new OpenChannelHandler() : new GroupChannelHandler();
    const handlerKeys = Object.keys(handler) as (keyof typeof handler)[];
    handlerKeys.forEach((key) => {
      handler[key] = (...args: unknown[]) => {
        // @ts-ignore
        handlerRef.current[key]?.(...args);
      };
    });

    if (type === 'group') {
      sdk.groupChannel.addGroupChannelHandler(handlerId, handler);
    } else if (type === 'open') {
      sdk.openChannel.addOpenChannelHandler(handlerId, handler);
    }

    return () => {
      if (type === 'group') {
        sdk.groupChannel.removeGroupChannelHandler(handlerId);
      } else if (type === 'open') {
        sdk.openChannel.removeOpenChannelHandler(handlerId);
      }
    };
  }, [sdk, handlerId]);
};
