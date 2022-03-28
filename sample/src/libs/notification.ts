import Notifee, { EventType } from '@notifee/react-native';
import type { Event } from '@notifee/react-native/dist/types/Notification';
import messaging from '@react-native-firebase/messaging';

import { isSendbirdNotification, parseSendbirdNotification } from '@sendbird/uikit-utils';

import { SendBirdInstance } from '../factory';
import { Routes, runAfterAppReady } from './navigation';

export const onNotificationEvent: (event: Event) => Promise<void> = async ({ type, detail }) => {
  if (type !== EventType.PRESS || !detail.notification) return;
  if (!isSendbirdNotification(detail.notification.data)) return;

  const sendbird = parseSendbirdNotification(detail.notification.data);
  if (sendbird.channel) {
    const channel = await SendBirdInstance.GroupChannel.getChannel(sendbird.channel.channel_url);
    runAfterAppReady(async (actions) => {
      actions.navigate(Routes.GroupChannel, { serializedChannel: channel.serialize() });
    });
  }
};

Notifee.onBackgroundEvent(onNotificationEvent);
messaging().setBackgroundMessageHandler(async (message) => {
  const channelId = await Notifee.createChannel({ id: 'default', name: 'Default Channel', importance: 4 });
  if (isSendbirdNotification(message.data)) {
    const sendbird = parseSendbirdNotification(message.data);
    try {
      SendBirdInstance.markAsDelivered(sendbird.channel.channel_url);
    } catch {}
    try {
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
    } catch (e) {
      console.log('display failure', e);
    } finally {
      console.log('Show');
    }
  }
});
