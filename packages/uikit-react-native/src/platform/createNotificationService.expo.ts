import type * as ExpoNotification from 'expo-notifications';

import type { ExpoPushPermissionResponse } from '../utils/expoPermissionGranted';
import type { NotificationServiceInterface } from './types';

const createExpoNotificationService = (messagingModule: typeof ExpoNotification): NotificationServiceInterface => {
  const authorizedStatus = [
    messagingModule.IosAuthorizationStatus.AUTHORIZED,
    messagingModule.IosAuthorizationStatus.PROVISIONAL,
  ];

  return {
    async getAPNSToken(): Promise<string | null> {
      const response = await messagingModule.getDevicePushTokenAsync();
      return response.data;
    },
    async getFCMToken(): Promise<string | null> {
      const response = await messagingModule.getDevicePushTokenAsync();
      return response.data;
    },
    async hasPushPermission(): Promise<boolean> {
      const status = (await messagingModule.getPermissionsAsync()) as ExpoPushPermissionResponse;
      return Boolean(status.granted || (status.ios?.status && authorizedStatus.includes(status.ios.status)));
    },
    async requestPushPermission(): Promise<boolean> {
      const status = (await messagingModule.requestPermissionsAsync()) as ExpoPushPermissionResponse;
      return Boolean(status.granted || (status.ios?.status && authorizedStatus.includes(status.ios.status)));
    },
    onTokenRefresh(handler: (token: string) => void): () => void | undefined {
      const subscription = messagingModule.addPushTokenListener(({ data }) => handler(data));
      return () => messagingModule.removePushTokenSubscription(subscription);
    },
  };
};

export default createExpoNotificationService;
