import RNFBMessaging from '@react-native-firebase/messaging';
import React from 'react';
import * as Permissions from 'react-native-permissions';

import {
  FileType,
  SendbirdUIKitContainer,
  createNativeNotificationService,
  useConnection,
  useSendbirdChat,
} from '@sendbird/uikit-react-native';

const PROFILE_FILE: FileType = { name: '', size: 0, type: '', uri: '' };

/**
 * Connect to the Sendbird server
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/authentication#2-connect-to-the-sendbird-server}
 * */
// TODO: import useConnection
// TODO: wrap with function component
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
/** ------------------ **/

/**
 * Disconnect from the Sendbird server
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/authentication#2-disconnect-from-the-sendbird-server}
 * */
// TODO: wrap with function component
const { disconnect } = useConnection();
disconnect();
/** ------------------ **/

/**
 * Retrieve online status of current user
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/authentication#2-retrieve-online-status-of-current-user}
 * */
// TODO: import useSendbirdChat
// TODO: wrap with function component
const { currentUser } = useSendbirdChat();

if (currentUser) {
  // User is online.
} else {
  // User is offline.
}
/** ------------------ **/

/**
 * Register for push notifications
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/authentication#2-register-for-push-notifications}
 * */
// TODO: import createNativeNotificationService
const NotificationService = createNativeNotificationService({
  messagingModule: RNFBMessaging,
  permissionModule: Permissions,
});

// TODO: wrap container with component
const App = () => {
  return (
    <SendbirdUIKitContainer
      appId={''}
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

// TODO: wrap container with component
const App2 = () => {
  return (
    <SendbirdUIKitContainer
      appId={''}
      // @ts-ignore
      platformServices={{}}
      chatOptions={{ enableAutoPushTokenRegistration: false }}
    />
  );
};
/** ------------------ **/

/**
 * Update user profile
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/authentication#2-update-user-profile}
 * */
const { updateCurrentUserInfo } = useSendbirdChat();

const updatedUserWithUrl = await updateCurrentUserInfo('NICKNAME', 'PROFILE_URL');

// Or you can update the profile image file.
const updatedUserWithFile = await updateCurrentUserInfo('NICKNAME', PROFILE_FILE);
/** ------------------ **/
