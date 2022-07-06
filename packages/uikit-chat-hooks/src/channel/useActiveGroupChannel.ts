import { useEffect, useState } from 'react';
import type Sendbird from 'sendbird';

import type { SendbirdChatSDK } from '@sendbird/uikit-utils';

export const useActiveGroupChannel = (sdk: SendbirdChatSDK, staleChannel: Sendbird.GroupChannel) => {
  const [activeChannel, setActiveChannel] = useState(() => staleChannel);

  useEffect(() => {
    sdk.GroupChannel.getChannel(staleChannel.url).then(setActiveChannel);
  }, [staleChannel.url]);

  return { activeChannel, setActiveChannel };
};
