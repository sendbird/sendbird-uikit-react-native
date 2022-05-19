import { useCallback } from 'react';

import { Logger } from '@sendbird/uikit-utils';

import { useSendbirdChat } from '../contexts/SendbirdChat';
import usePushTokenRegistration from './usePushTokenRegistration';

type Options = {
  // autoConnection?: boolean;
  nickname?: string;
  accessToken?: string;
};

const useConnection = () => {
  const { sdk, autoPushTokenRegistration, setCurrentUser } = useSendbirdChat();
  const { registerPushTokenForCurrentUser, unregisterPushTokenForCurrentUser } = usePushTokenRegistration(false);

  const connect = useCallback(
    async (userId: string, opts?: Options) => {
      Logger.debug('[useConnection]', 'connect started', userId);

      try {
        if (opts?.accessToken) await sdk.connect(userId, opts.accessToken);
        else await sdk.connect(userId);
      } catch (e) {
        // @ts-ignore
        Logger.warn('[useConnection]', 'connect failure', e.message, e.code);
      }

      Logger.debug('[useConnection]', 'connected!');
      setCurrentUser(sdk.currentUser);

      if (opts?.nickname) {
        Logger.debug('[useConnection]', 'nickname sync started', opts.nickname);
        await sdk.updateCurrentUserInfo(opts.nickname, sdk.currentUser.profileUrl);
        setCurrentUser(sdk.currentUser);
      }

      try {
        if (autoPushTokenRegistration) {
          Logger.debug('[useConnection]', 'autoPushTokenRegistration enabled, register for current user');
          await registerPushTokenForCurrentUser();
        }
      } catch (e) {
        Logger.warn('[useConnection]', 'registerPushTokenForCurrentUser failure', e);
      }

      return sdk.currentUser;
    },
    [sdk],
  );

  const disconnect = useCallback(async () => {
    Logger.debug('[useConnection]', 'disconnect started');

    try {
      if (autoPushTokenRegistration) {
        Logger.debug('[useConnection]', 'autoPushTokenRegistration enabled, unregister for current user');
        await unregisterPushTokenForCurrentUser();
      }
    } catch (e) {
      Logger.warn('[useConnection]', 'unregisterPushTokenForCurrentUser failure', e);
    }

    await sdk.disconnect();
    setCurrentUser(undefined);
    Logger.debug('[useConnection]', 'disconnected!');
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
