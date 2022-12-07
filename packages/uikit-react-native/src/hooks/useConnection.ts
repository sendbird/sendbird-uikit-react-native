import { useCallback } from 'react';

import { Logger, SendbirdError, SendbirdUser } from '@sendbird/uikit-utils';

import { useSendbirdChat } from './useContext';
import usePushTokenRegistration from './usePushTokenRegistration';

type ConnectOptions = { nickname?: string; accessToken?: string };
const cacheRestrictCodes = [400300, 400301, 400302, 400310];

const useConnection = () => {
  const { sdk, emojiManager, setCurrentUser, features } = useSendbirdChat();
  const { registerPushTokenForCurrentUser, unregisterPushTokenForCurrentUser } = usePushTokenRegistration();

  const connect = useCallback(
    async (userId: string, opts?: ConnectOptions): Promise<SendbirdUser> => {
      try {
        Logger.debug('[useConnection]', 'connect start:', userId);
        let user = await sdk.connect(userId, opts?.accessToken);

        if (opts?.nickname) {
          Logger.debug('[useConnection]', 'nickname-sync start:', opts.nickname);
          await sdk
            .updateCurrentUserInfo({ nickname: opts.nickname })
            .then((updatedUser) => (user = updatedUser))
            .catch((e) => Logger.warn('[useConnection]', 'nickname-sync failure', e));
        } else if (features.useUserIdForNicknameEnabled) {
          await sdk.updateCurrentUserInfo({ nickname: userId }).then((updatedUser) => (user = updatedUser));
        }

        if (features.autoPushTokenRegistrationEnabled) {
          Logger.debug('[useConnection]', 'autoPushTokenRegistration enabled, register for current user');
          await registerPushTokenForCurrentUser().catch((e) => {
            Logger.warn('[useConnection]', 'autoPushToken Registration failure', e);
          });
        }

        Logger.debug('[useConnection]', 'connected! (online)');
        setCurrentUser(user);
        sdk.getAllEmoji().then(emojiManager.init);

        return user;
      } catch (e) {
        const error = e as unknown as SendbirdError;

        if (sdk.isCacheEnabled) {
          if (cacheRestrictCodes.some((code) => error.code === code)) {
            Logger.warn('[useConnection]', 'offline connect restricted', error.message, error.code);
            Logger.warn('[useConnection]', 'clear cached-data');
            await sdk.clearCachedData().catch((e) => Logger.warn('[useConnection]', 'clear cached-data failure', e));
          } else if (sdk.currentUser) {
            Logger.debug('[useConnection]', 'connected! (offline)');
            setCurrentUser(sdk.currentUser);
            sdk.getAllEmoji().finally(emojiManager.init);
            return sdk.currentUser;
          }
        }

        Logger.warn('[useConnection]', 'connect failure', error.message, error.code);
        throw error;
      }
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

    await sdk.disconnect().then(() => setCurrentUser(undefined));
    Logger.debug('[useConnection]', 'disconnected!');
  }, [sdk, unregisterPushTokenForCurrentUser, features.autoPushTokenRegistrationEnabled]);

  return { connect, disconnect, reconnect: () => sdk.reconnect() };
};

export default useConnection;
