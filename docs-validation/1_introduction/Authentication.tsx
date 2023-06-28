import React from 'react';

import type { FileType } from '@sendbird/uikit-react-native';
const PROFILE_FILE: FileType = { name: '', size: 0, type: '', uri: '' };

/**
 * Connect to the Sendbird server
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/authentication#2-connect-to-the-sendbird-server}
 * */
import { useConnection } from '@sendbird/uikit-react-native';

const Component = () => {
  const { connect } = useConnection();

  connect('USER_ID', { nickname: 'NICKNAME', accessToken: 'ACCESS_TOKEN' })
    .then((_user) => {
      // 1. The user is online and connected to the server.
      // 2. The user is offline but you can access user information stored
      // in the local cache.
    })
    .catch((_err) => {
      // The user is offline and you can't access any user information stored
      // in the local cache.
    });
};
/** ------------------ **/

/**
 * Disconnect from the Sendbird server
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/authentication#2-disconnect-from-the-sendbird-server}
 * */
const Component2 = () => {
  const { disconnect } = useConnection();
  disconnect();
}
/** ------------------ **/

/**
 * Retrieve online status of current user
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/authentication#2-retrieve-online-status-of-current-user}
 * */
import { useSendbirdChat } from '@sendbird/uikit-react-native';

const Component3 = () => {
  const { currentUser } = useSendbirdChat();

  if (currentUser) {
    // User is online.
  } else {
    // User is offline.
  }
}
/** ------------------ **/

/**
 * Register for push notifications
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/authentication#2-register-for-push-notifications}
 * */
import RNFBMessaging from '@react-native-firebase/messaging';
import * as Permissions from 'react-native-permissions';
import { SendbirdUIKitContainer, createNativeNotificationService } from '@sendbird/uikit-react-native';

const NotificationService = createNativeNotificationService({
  messagingModule: RNFBMessaging,
  permissionModule: Permissions,
});

const App = () => {
  return (
    <SendbirdUIKitContainer
      // @ts-ignore
      platformServices={{ notification: NotificationService }}
    />
  );
};
/** ------------------ **/

/**
 * Unregister push notifications
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/authentication#2-unregister-push-notifications}
 * */
const App2 = () => {
  return (
    // @ts-ignore
    <SendbirdUIKitContainer
      // @ts-ignore
      chatOptions={{ enableAutoPushTokenRegistration: false }}
    />
  );
};
/** ------------------ **/

/**
 * Update user profile
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/authentication#2-update-user-profile}
 * */
const Component4 = () => {
  const { updateCurrentUserInfo } = useSendbirdChat();

  const update = async () => {
    const updatedUserWithUrl = await updateCurrentUserInfo('NICKNAME', 'PROFILE_URL');

    // Or you can update the profile image file.
    const updatedUserWithFile = await updateCurrentUserInfo('NICKNAME', PROFILE_FILE);
  }
}
/** ------------------ **/
