import { useCallback } from 'react';

import { Logger } from '@sendbird/uikit-utils';

import { useSendbirdChat } from '../contexts/SendbirdChat';
import usePushTokenRegistration from './usePushTokenRegistration';

type Options = {
  // autoConnection?: boolean;
  autoPushTokenRegistration?: boolean;
};

const useConnection = (opts?: Options) => {
  const { sdk, setCurrentUser } = useSendbirdChat();
  const { registerPushTokenForCurrentUser, unregisterPushTokenForCurrentUser } = usePushTokenRegistration();

  const connect = useCallback(
    async (userId: string, accessToken?: string) => {
      if (accessToken) await sdk.connect(userId, accessToken);
      else await sdk.connect(userId);

      setCurrentUser(sdk.currentUser);

      try {
        if (opts?.autoPushTokenRegistration) await registerPushTokenForCurrentUser();
      } catch {
        Logger.warn('registerPushTokenForCurrentUser failure');
      }

      return sdk.currentUser;
    },
    [sdk],
  );
  const disconnect = useCallback(async () => {
    try {
      if (opts?.autoPushTokenRegistration) await unregisterPushTokenForCurrentUser();
    } catch {
      Logger.warn('unregisterPushTokenForCurrentUser failure');
    }

    await sdk.disconnect();
    setCurrentUser(undefined);
  }, [sdk]);

  // useEffect(() => {
  //   if (!opts?.autoConnection) return;
  //
  //   if (userId) connect(userId, accessToken);
  //   else disconnect();
  // }, [opts?.autoConnection, userId, accessToken, connect, disconnect]);

  return { connect, disconnect, reconnect: sdk.reconnect };
};

export default useConnection;
