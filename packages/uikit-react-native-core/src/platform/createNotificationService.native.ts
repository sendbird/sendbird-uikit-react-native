import type RNFBMessaging from '@react-native-firebase/messaging';

import type { NotificationServiceInterface } from './types';

const createNativeNotificationService = (messagingModule: typeof RNFBMessaging): NotificationServiceInterface => {
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
      const status = await module.hasPermission();
      return authorizedStatus.includes(status);
    },
    async requestPushPermission(): Promise<boolean> {
      const status = await module.requestPermission();
      return authorizedStatus.includes(status);
    },
    onTokenRefresh(handler: (token: string) => void): () => void | undefined {
      return module.onTokenRefresh(handler);
    },
  };
};

export default createNativeNotificationService;
