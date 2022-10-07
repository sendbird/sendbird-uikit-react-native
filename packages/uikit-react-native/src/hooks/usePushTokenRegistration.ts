import { useRef } from 'react';
import { Platform } from 'react-native';

import { Logger, useFreshCallback, useIIFE } from '@sendbird/uikit-utils';

import { usePlatformService, useSendbirdChat } from './useContext';

const usePushTokenRegistration = () => {
  const { sdk } = useSendbirdChat();
  const { notificationService } = usePlatformService();

  const refreshListener = useRef<() => void>();
  const [registerToken, unregisterToken, getToken] = useIIFE(() => {
    return [
      Platform.select({
        ios: (token: string) => sdk.registerAPNSPushTokenForCurrentUser(token),
        default: (token: string) => sdk.registerFCMPushTokenForCurrentUser(token),
      }),
      Platform.select({
        ios: (token: string) => sdk.unregisterAPNSPushTokenForCurrentUser(token),
        default: (token: string) => sdk.unregisterFCMPushTokenForCurrentUser(token),
      }),
      Platform.select({
        ios: notificationService.getAPNSToken,
        default: notificationService.getFCMToken,
      }),
    ];
  });

  const registerPushTokenForCurrentUser = useFreshCallback(async () => {
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
  });

  const unregisterPushTokenForCurrentUser = useFreshCallback(async () => {
    const token = await getToken();
    if (token) {
      unregisterToken(token);
      Logger.log('[usePushTokenRegistration]', 'unregistered token:', token);
    }
    refreshListener.current?.();
  });

  return { registerPushTokenForCurrentUser, unregisterPushTokenForCurrentUser };
};

export default usePushTokenRegistration;
