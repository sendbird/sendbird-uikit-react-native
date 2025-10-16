import type RNFBMessaging from '@react-native-firebase/messaging';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import type * as Permissions from 'react-native-permissions';

import type { NotificationServiceInterface } from './types';

// Type definitions for Firebase Messaging Module instance
// This represents the instance returned by messaging() or getMessaging()
// We use a type alias to handle both v14 and v22+ types
type MessagingInstance = ReturnType<typeof RNFBMessaging>;

// Type definitions for modular API support (Firebase v22+)
// The modular API provides standalone functions that accept a messaging instance
type ModularMessagingType = {
  getMessaging: () => MessagingInstance;
  getAPNSToken: (messaging: MessagingInstance) => Promise<string | null>;
  getToken: (messaging: MessagingInstance) => Promise<string>;
  hasPermission: (messaging: MessagingInstance) => Promise<FirebaseMessagingTypes.AuthorizationStatus>;
  requestPermission: (
    messaging: MessagingInstance,
    iosPermissions?: FirebaseMessagingTypes.IOSPermissions,
  ) => Promise<FirebaseMessagingTypes.AuthorizationStatus>;
  onTokenRefresh: (messaging: MessagingInstance, listener: (token: string) => void) => () => void;
  AuthorizationStatus: typeof RNFBMessaging.AuthorizationStatus;
};

// Create a flexible type that can handle both v14 and v22+ Firebase modules
type FirebaseMessagingModule = typeof RNFBMessaging | ModularMessagingType;

const isModularAPI = (module: FirebaseMessagingModule): module is ModularMessagingType => {
  return typeof (module as ModularMessagingType).getMessaging === 'function';
};

const createNativeNotificationService = ({
  messagingModule,
  permissionModule,
}: {
  messagingModule: FirebaseMessagingModule;
  permissionModule: typeof Permissions;
}): NotificationServiceInterface => {
  const isModular = isModularAPI(messagingModule);
  const modularMessaging = isModular ? (messagingModule as ModularMessagingType) : null;
  const messaging = isModular ? modularMessaging!.getMessaging() : (messagingModule as typeof RNFBMessaging)();

  const authorizedStatus = [
    messagingModule.AuthorizationStatus.AUTHORIZED,
    messagingModule.AuthorizationStatus.PROVISIONAL,
  ];
  return {
    getAPNSToken(): Promise<string | null> {
      if (modularMessaging) {
        return modularMessaging.getAPNSToken(messaging);
      }
      return messaging.getAPNSToken();
    },
    getFCMToken(): Promise<string | null> {
      if (modularMessaging) {
        return modularMessaging.getToken(messaging);
      }
      return messaging.getToken();
    },
    async hasPushPermission(): Promise<boolean> {
      if (Platform.OS === 'android') {
        const result = await permissionModule.checkNotifications();
        return result.status === 'granted';
      }

      if (Platform.OS === 'ios') {
        const status = modularMessaging
          ? await modularMessaging.hasPermission(messaging)
          : await messaging.hasPermission();
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
        const status = modularMessaging
          ? await modularMessaging.requestPermission(messaging)
          : await messaging.requestPermission();
        return authorizedStatus.includes(status);
      }

      return false;
    },
    onTokenRefresh(handler: (token: string) => void): () => void | undefined {
      if (modularMessaging) {
        return modularMessaging.onTokenRefresh(messaging, (token: string) => {
          if (Platform.OS === 'android') handler(token);
        });
      }
      return messaging.onTokenRefresh((token: string) => {
        if (Platform.OS === 'android') handler(token);
      });
    },
  };
};

export default createNativeNotificationService;
