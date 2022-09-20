import { useEffect, useState } from 'react';

import type { SendbirdChatSDK, SendbirdGroupChannel } from '@sendbird/uikit-utils';

export const useActiveGroupChannel = (sdk: SendbirdChatSDK, staleChannel: SendbirdGroupChannel) => {
  const [activeChannel, setActiveChannel] = useState(() => staleChannel);

  useEffect(() => {
    sdk.groupChannel.getChannel(staleChannel.url).then(setActiveChannel);
  }, [staleChannel.url]);

  return { activeChannel, setActiveChannel };
};
