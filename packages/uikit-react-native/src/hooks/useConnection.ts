import { useCallback } from 'react';
import type Sendbird from 'sendbird';

import { Logger, SendbirdUser } from '@sendbird/uikit-utils';

import { useSendbirdChat } from '../contexts/SendbirdChat';
import usePushTokenRegistration from './usePushTokenRegistration';

type ConnectOptions = { nickname?: string; accessToken?: string };
const cacheStrictCodes = [400300, 400301, 400302, 400310];

const useConnection = () => {
  const { sdk, setCurrentUser, features } = useSendbirdChat();
  const { registerPushTokenForCurrentUser, unregisterPushTokenForCurrentUser } = usePushTokenRegistration();

  const connect = useCallback(
    async (userId: string, opts?: ConnectOptions): Promise<SendbirdUser> => {
      return new Promise((resolve, reject) => {
        const callback: Sendbird.userCallback = async (user, error) => {
          if (error && sdk.isCacheEnabled && cacheStrictCodes.some((code) => error.code === code)) {
            Logger.warn('[useConnection]', 'connect failure', error.message, error.code);
            Logger.warn('[useConnection]', 'clear cached-data');
            await sdk.clearCachedData().catch((e) => Logger.warn('[useConnection]', 'clear cached-data failure', e));
            return reject(error);
          }

          if (user) {
            let _user = user;

            if (opts?.nickname) {
              Logger.debug('[useConnection]', 'nickname-sync start:', opts.nickname);
              await sdk
                .updateCurrentUserInfo(opts.nickname, sdk.currentUser.profileUrl)
                .then((updatedUser) => (_user = updatedUser))
                .catch((e) => Logger.warn('[useConnection]', 'nickname-sync failure', e));
            }

            if (features.autoPushTokenRegistrationEnabled) {
              Logger.debug('[useConnection]', 'autoPushTokenRegistration enabled, register for current user');
              await registerPushTokenForCurrentUser().catch((e) => {
                Logger.warn('[useConnection]', 'autoPushToken Registration failure', e);
              });
            }

            Logger.debug('[useConnection]', 'connected!');
            setCurrentUser(_user);
            return resolve(_user);
          }

          if (error) {
            Logger.warn('[useConnection]', 'connect failure', error.message, error.code);
            return reject(error);
          }
        };

        Logger.debug('[useConnection]', 'connect start:', userId);
        if (opts?.accessToken) sdk.connect(userId, opts.accessToken, callback);
        else sdk.connect(userId, callback);
      });
    },
    [sdk, registerPushTokenForCurrentUser, features.autoPushTokenRegistrationEnabled],
  );

  const disconnect = useCallback(async () => {
    Logger.debug('[useConnection]', 'disconnect start');

    if (features.autoPushTokenRegistrationEnabled) {
      Logger.debug('[useConnection]', 'autoPushTokenRegistration enabled, unregister for current user');
      await unregisterPushTokenForCurrentUser().catch((e) => {
        Logger.warn('[useConnection]', 'autoPushToken unregister failure', e);
      });
    }

    await sdk.disconnect();
    setCurrentUser(undefined);
    Logger.debug('[useConnection]', 'disconnected!');
  }, [sdk, unregisterPushTokenForCurrentUser, features.autoPushTokenRegistrationEnabled]);

  return { connect, disconnect, reconnect: sdk.reconnect };
};

export default useConnection;
