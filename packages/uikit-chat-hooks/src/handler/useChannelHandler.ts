import { useEffect, useLayoutEffect, useRef } from 'react';

import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import { OpenChannelHandler } from '@sendbird/chat/openChannel';
import type { SendbirdChatSDK } from '@sendbird/uikit-utils';

type ChannelType = 'open' | 'group';

export const useChannelHandler = <T extends ChannelType = 'group'>(
  sdk: SendbirdChatSDK,
  handlerId: string,
  hookHandler: Partial<T extends 'group' ? GroupChannelHandler : OpenChannelHandler>,
  type: T = 'group' as T,
) => {
  const handlerRef = useRef(hookHandler);
  useLayoutEffect(() => {
    handlerRef.current = hookHandler;
  });

  useEffect(() => {
    const handlerMapper = <T extends GroupChannelHandler | OpenChannelHandler>(handler: T): T => {
      const handlerKeys = Object.keys(handler) as (keyof T)[];
      handlerKeys.forEach((key) => {
        // @ts-ignore
        handler[key] = (...args: unknown[]) => handlerRef.current?.[key]?.(...args);
      });
      return handler;
    };

    if (type === 'group') {
      sdk.groupChannel.addGroupChannelHandler(handlerId, handlerMapper(new GroupChannelHandler()));
    } else if (type === 'open') {
      sdk.openChannel.addOpenChannelHandler(handlerId, handlerMapper(new OpenChannelHandler()));
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
