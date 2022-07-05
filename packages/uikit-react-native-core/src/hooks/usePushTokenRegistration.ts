import { useCallback, useRef } from 'react';
import { Platform } from 'react-native';

import { Logger, useIIFE } from '@sendbird/uikit-utils';

import { usePlatformService } from '../contexts/PlatformService';
import { useSendbirdChat } from '../contexts/SendbirdChat';

const usePushTokenRegistration = () => {
  const { sdk } = useSendbirdChat();
  const { notificationService } = usePlatformService();

  const refreshListener = useRef<() => void>();
  const [registerToken, unregisterToken, getToken] = useIIFE(() => {
    return [
      Platform.select({
        ios: (token: string) => sdk.registerAPNSPushTokenForCurrentUser(token),
        default: (token: string) => sdk.registerGCMPushTokenForCurrentUser(token),
      }),
      Platform.select({
        ios: (token: string) => sdk.unregisterAPNSPushTokenForCurrentUser(token),
        default: (token: string) => sdk.unregisterGCMPushTokenForCurrentUser(token),
      }),
      Platform.select({
        ios: notificationService.getAPNSToken,
        default: notificationService.getFCMToken,
      }),
    ];
  });

  const registerPushTokenForCurrentUser = useCallback(async () => {
    // Check and request push permission
    const hasPermission = await notificationService.hasPushPermission();
    if (!hasPermission) {
      const pushPermission = await notificationService.requestPushPermission();
      if (!pushPermission) {
        Logger.warn('[usePushTokenRegistration]', 'Not granted push permission');
        return;
      }
    }

    // Register device token
    const token = await getToken();
    if (token) {
      Logger.log('[usePushTokenRegistration]', 'registered token:', token);
      registerToken(token);
    }

    // Remove listener
    refreshListener.current = notificationService.onTokenRefresh(registerToken);
  }, [notificationService, getToken, registerToken]);

  const unregisterPushTokenForCurrentUser = useCallback(async () => {
    const token = await getToken();
    if (token) {
      unregisterToken(token);
      Logger.log('[usePushTokenRegistration]', 'unregistered token:', token);
    }
    refreshListener.current?.();
  }, [getToken, unregisterToken]);

  return { registerPushTokenForCurrentUser, unregisterPushTokenForCurrentUser };
};

export default usePushTokenRegistration;
