import Notifee, { EventType } from '@notifee/react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

import { SendbirdDataPayload, isSendbirdNotification, parseSendbirdNotification } from '@sendbird/uikit-utils';

import { Routes, navigationRef, runAfterAppReady } from './navigation';

type Unsubscribe = () => void;
type NotificationHandler = (payload: SendbirdDataPayload) => void;
type NotificationHandlers = {
  onAppOpened: NotificationHandler;
  onForeground: NotificationHandler;
  onBackground: NotificationHandler;
};

const ANDROID_NOTIFICATION_CHANNEL_ID = 'default';

class NotificationOpenHandler {
  constructor(public handlers: NotificationHandlers) {
    Notifee.createChannel({ id: ANDROID_NOTIFICATION_CHANNEL_ID, name: 'Default Channel', importance: 4 });
  }

  public startOnAppOpened() {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.getInitialNotification().then(async (notification) => {
        const data = notification?.getData();
        if (data?.userInteraction === 1 && isSendbirdNotification(data)) {
          const payload = parseSendbirdNotification(data);
          this.handlers.onAppOpened(payload);
        }
      });
    }

    if (Platform.OS === 'android') {
      // NOOP - Sendbird supports data-only notification on FCM
    }
  }

  public startOnForeground(): Unsubscribe {
    const unsubscribes: Unsubscribe[] = [];

    if (Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener('localNotification', async (notification) => {
        const data = notification.getData();
        if (data.userInteraction === 1 && isSendbirdNotification(data)) {
          const payload = parseSendbirdNotification(data);
          this.handlers.onForeground(payload);
        }
      });
      unsubscribes.push(() => PushNotificationIOS.removeEventListener('localNotification'));
    }

    if (Platform.OS === 'android') {
      unsubscribes.push(
        Notifee.onForegroundEvent(async ({ type, detail }) => {
          if (type === EventType.PRESS && detail.notification && isSendbirdNotification(detail.notification.data)) {
            const payload = parseSendbirdNotification(detail.notification.data);
            this.handlers.onForeground(payload);
          }
        }),
      );
    }

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }

  public startOnBackground() {
    if (Platform.OS === 'ios') {
      // NOOP - Sendbird does not supports silent notification(data-only) on APNS
    }

    if (Platform.OS === 'android') {
      Notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.PRESS && detail.notification && isSendbirdNotification(detail.notification.data)) {
          const payload = parseSendbirdNotification(detail.notification.data);
          this.handlers.onBackground(payload);
        }
      });

      // Bypass data-only message to Notifee
      messaging().setBackgroundMessageHandler(async (message: FirebaseMessagingTypes.RemoteMessage) => {
        if (isSendbirdNotification(message.data)) {
          const sendbird = parseSendbirdNotification(message.data);
          await Notifee.displayNotification({
            id: String(sendbird.message_id),
            title: `[RN]${sendbird.channel.name || sendbird.sender?.name || 'Message received'}`,
            body: sendbird.message,
            data: message.data,
            android: {
              channelId: ANDROID_NOTIFICATION_CHANNEL_ID,
              importance: 4,
              largeIcon: sendbird.sender?.profile_url || sendbird.channel.channel_url,
              circularLargeIcon: true,
              pressAction: { id: 'default' },
              showTimestamp: true,
              timestamp: sendbird.created_at,
            },
          });
        }
      });
    }
  }
}

const navigateToChannel = (sendbird: SendbirdDataPayload) => {
  runAfterAppReady((_, actions) => {
    const channelUrl = sendbird.channel.channel_url;
    if (Routes.Home === navigationRef.getCurrentRoute()?.name) {
      actions.push(Routes.GroupChannelTabs, { channelUrl });
    } else {
      actions.navigate(Routes.GroupChannel, { channelUrl });
    }
  });
};

export const notificationHandler = new NotificationOpenHandler({
  onAppOpened: async (payload) => {
    navigateToChannel(payload);
  },
  onForeground: async (payload) => {
    navigateToChannel(payload);
  },
  onBackground: async (payload) => {
    navigateToChannel(payload);
  },
});

notificationHandler.startOnBackground();
