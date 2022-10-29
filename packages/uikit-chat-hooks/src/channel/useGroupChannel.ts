import { useState } from 'react';

import { SendbirdChatSDK, SendbirdGroupChannel, useAsyncEffect } from '@sendbird/uikit-utils';

export const useGroupChannel = (sdk: SendbirdChatSDK, channelUrl: string) => {
  const [channel, setChannel] = useState<SendbirdGroupChannel>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useAsyncEffect(async () => {
    try {
      setChannel(await sdk.groupChannel.getChannel(channelUrl));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return { channel, loading, error };
};
