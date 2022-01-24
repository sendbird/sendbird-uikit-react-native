import { useCallback, useEffect } from 'react';

import { useSendbirdChat } from '../context/SendbirdChat';
import usePushTokenRegistration from './usePushTokenRegistration';

const useConnection = (autoEnabled?: boolean) => {
  const { sdk, userId, accessToken } = useSendbirdChat();
  const { registerPushTokenForCurrentUser, unregisterPushTokenForCurrentUser } = usePushTokenRegistration();

  const connect = useCallback(
    async (userId: string, accessToken?: string) => {
      if (accessToken) await sdk.connect(userId, accessToken);
      else await sdk.connect(userId);
      await registerPushTokenForCurrentUser();
      return sdk.currentUser;
    },
    [sdk],
  );
  const disconnect = useCallback(async () => {
    await unregisterPushTokenForCurrentUser();
    await sdk.disconnect();
  }, [sdk]);

  useEffect(() => {
    if (!autoEnabled) return;

    if (userId) connect(userId, accessToken);
    else disconnect();
  }, [autoEnabled, userId, accessToken, connect, disconnect]);

  return { connect, disconnect, reconnect: sdk.reconnect };
};

export default useConnection;
