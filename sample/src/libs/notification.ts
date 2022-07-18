import Notifee, { EventType } from '@notifee/react-native';
import type { Event } from '@notifee/react-native/dist/types/Notification';
import PushNotificationIOS, { PushNotification } from '@react-native-community/push-notification-ios';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

import { NOOP, isSendbirdNotification, parseSendbirdNotification } from '@sendbird/uikit-utils';

import { Routes, navigationRef, runAfterAppReady } from './navigation';

const channelId = 'default';
Notifee.createChannel({ id: channelId, name: 'Default Channel', importance: 4 });

export const onNotificationAndroid: (event: Event) => Promise<void> = async ({ type, detail }) => {
  if (Platform.OS !== 'android') return;

  if (type === EventType.PRESS && detail.notification && isSendbirdNotification(detail.notification.data)) {
    const sendbird = parseSendbirdNotification(detail.notification.data);
    runAfterAppReady(async (sdk, actions) => {
      if (Routes.Home === navigationRef.getCurrentRoute()?.name) {
        actions.push(Routes.GroupChannelTabs, undefined);
      }

      const channel = await sdk.GroupChannel.getChannel(sendbird.channel.channel_url);
      actions.navigate(Routes.GroupChannel, { serializedChannel: channel.serialize() });
    });
  }
};

export const onForegroundAndroid = () => Notifee.onForegroundEvent(onNotificationAndroid);
export const onForegroundIOS = () => {
  if (Platform.OS !== 'ios') return NOOP;

  const onNotificationIOS = (notification: PushNotification) => {
    const data = notification.getData();
    if (data.userInteraction === 1 && isSendbirdNotification(data)) {
      const sendbird = parseSendbirdNotification(data);
      runAfterAppReady(async (sdk, actions) => {
        if (Routes.Home === navigationRef.getCurrentRoute()?.name) {
          actions.push(Routes.GroupChannelTabs, undefined);
        }

        const channel = await sdk.GroupChannel.getChannel(sendbird.channel.channel_url);
        actions.navigate(Routes.GroupChannel, { serializedChannel: channel.serialize() });
      });
    }
  };

  const checkAppOpenedWithNotification = async () => {
    const notification = await PushNotificationIOS.getInitialNotification();
    notification && onNotificationIOS(notification);
  };

  checkAppOpenedWithNotification();
  PushNotificationIOS.addEventListener('localNotification', onNotificationIOS);
  return () => PushNotificationIOS.removeEventListener('localNotification');
};

Notifee.onBackgroundEvent(onNotificationAndroid);
messaging().setBackgroundMessageHandler(async (message: FirebaseMessagingTypes.RemoteMessage) => {
  if (Platform.OS !== 'android') return;

  if (isSendbirdNotification(message.data)) {
    const sendbird = parseSendbirdNotification(message.data);
    await Notifee.displayNotification({
      id: String(sendbird.message_id),
      title: sendbird.channel.name || sendbird.sender?.name || 'Message received',
      body: sendbird.message,
      data: message.data,
      android: {
        channelId,
        importance: 4,
        // smallIcon: 'drawable/icon_push_lollipop',
        largeIcon: sendbird.sender?.profile_url || sendbird.channel.channel_url,
        circularLargeIcon: true,
        pressAction: { id: 'default' },
        showTimestamp: true,
        timestamp: sendbird.created_at,
      },
      ios: {
        threadId: sendbird.channel.channel_url,
      },
    });
  }
});
