import type RNFBMessaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import type * as Permissions from 'react-native-permissions';

import type { NotificationServiceInterface } from './types';

const createNativeNotificationService = ({
  messagingModule,
  permissionModule,
}: {
  messagingModule: typeof RNFBMessaging;
  permissionModule: typeof Permissions;
}): NotificationServiceInterface => {
  const module = messagingModule();
  const authorizedStatus = [
    messagingModule.AuthorizationStatus.AUTHORIZED,
    messagingModule.AuthorizationStatus.PROVISIONAL,
  ];
  return {
    getAPNSToken(): Promise<string | null> {
      return module.getAPNSToken();
    },
    getFCMToken(): Promise<string | null> {
      return module.getToken();
    },
    async hasPushPermission(): Promise<boolean> {
      if (Platform.OS === 'android') {
        const result = await permissionModule.checkNotifications();
        return result.status === 'granted';
      }

      if (Platform.OS === 'ios') {
        const status = await module.hasPermission();
        return authorizedStatus.includes(status);
      }

      return false;
    },
    async requestPushPermission(): Promise<boolean> {
      if (Platform.OS === 'android') {
        const result = await permissionModule.requestNotifications([]);
        return result.status === 'granted';
      }

      if (Platform.OS === 'ios') {
        const status = await module.requestPermission();
        return authorizedStatus.includes(status);
      }

      return false;
    },
    onTokenRefresh(handler: (token: string) => void): () => void | undefined {
      return module.onTokenRefresh((token) => {
        if (Platform.OS === 'android') handler(token);
      });
    },
  };
};

export default createNativeNotificationService;
