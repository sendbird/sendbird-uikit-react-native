import { useState } from 'react';

import { SendbirdChatSDK, SendbirdOpenChannel, useAsyncEffect } from '@sendbird/uikit-utils';

export const useOpenChannel = (sdk: SendbirdChatSDK, channelUrl: string) => {
  const [channel, setChannel] = useState<SendbirdOpenChannel>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useAsyncEffect(async () => {
    try {
      setChannel(await sdk.openChannel.getChannel(channelUrl));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return { channel, loading, error };
};
