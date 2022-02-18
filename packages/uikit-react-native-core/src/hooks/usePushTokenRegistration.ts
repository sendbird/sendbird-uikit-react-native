import { useCallback, useMemo, useRef } from 'react';
import { Platform } from 'react-native';

import { Logger } from '@sendbird/uikit-utils';

import { usePlatformService } from '../contexts/PlatformService';
import { useSendbirdChat } from '../contexts/SendbirdChat';

const usePushTokenRegistration = () => {
  const { sdk } = useSendbirdChat();
  const { notificationService } = usePlatformService();

  const refreshListener = useRef<() => void>();
  const [registerToken, unregisterToken, getToken] = useMemo(() => {
    return [
      Platform.select({
        ios: sdk.registerAPNSPushTokenForCurrentUser,
        default: sdk.registerGCMPushTokenForCurrentUser,
      }),
      Platform.select({
        ios: sdk.unregisterAPNSPushTokenForCurrentUser,
        default: sdk.unregisterGCMPushTokenForCurrentUser,
      }),
      Platform.select({
        ios: notificationService.getAPNSToken,
        default: notificationService.getFCMToken,
      }),
    ];
  }, [sdk, notificationService]);

  const registerPushTokenForCurrentUser = useCallback(async () => {
    // Check and request push permission
    if (!(await notificationService.hasPushPermission())) {
      const pushPermission = await notificationService.requestPushPermission();
      if (!pushPermission) {
        Logger.warn('[usePushTokenRegistration]', 'Not granted push permission');
        return;
      }
    }

    // Register device token
    const token = await getToken();
    if (token) registerToken(token);

    // Remove listener
    refreshListener.current = notificationService.onTokenRefresh(
      (token) => Platform.OS !== 'ios' && registerToken(token),
    );
  }, [notificationService, getToken, registerToken]);

  const unregisterPushTokenForCurrentUser = useCallback(async () => {
    const token = await getToken();
    if (token) unregisterToken(token);
    refreshListener.current?.();
  }, [getToken, unregisterToken]);

  return { registerPushTokenForCurrentUser, unregisterPushTokenForCurrentUser };
};

export default usePushTokenRegistration;
