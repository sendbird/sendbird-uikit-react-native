import * as ImageResizer from '@bam.tech/react-native-image-resizer';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Clipboard from '@react-native-clipboard/clipboard';
import RNFBMessaging from '@react-native-firebase/messaging';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, StatusBar } from 'react-native';
import * as CreateThumbnail from 'react-native-create-thumbnail';
import * as DocumentPicker from 'react-native-document-picker';
import * as FileAccess from 'react-native-file-access';
import * as ImagePicker from 'react-native-image-picker';
import * as Permissions from 'react-native-permissions';
import Video from 'react-native-video';

import {
  createNativeClipboardService,
  createNativeFileService,
  createNativeMediaService,
  createNativeNotificationService,
} from '@sendbird/uikit-react-native';
import { Logger, SendbirdChatSDK } from '@sendbird/uikit-utils';

import { APP_ID } from '../env';

let AppSendbirdSDK: SendbirdChatSDK;
export const GetSendbirdSDK = () => AppSendbirdSDK;
export const SetSendbirdSDK = (sdk: SendbirdChatSDK) => (AppSendbirdSDK = sdk);

export const RootStack = createNativeStackNavigator();
export const ClipboardService = createNativeClipboardService(Clipboard);
export const NotificationService = createNativeNotificationService({
  messagingModule: RNFBMessaging,
  permissionModule: Permissions,
});
export const FileService = createNativeFileService({
  imagePickerModule: ImagePicker,
  documentPickerModule: DocumentPicker,
  permissionModule: Permissions,
  fsModule: FileAccess,
  mediaLibraryModule: CameraRoll,
});
export const MediaService = createNativeMediaService({
  VideoComponent: Video,
  thumbnailModule: CreateThumbnail,
  imageResizerModule: ImageResizer,
});

export const GetTranslucent = (state = true) => {
  Platform.OS === 'android' && StatusBar.setTranslucent(state);
  return Platform.select({ ios: state, android: state });
};

const createSendbirdAPI = (appId: string, apiToken: string) => {
  const MIN = 60 * 1000;
  const endpoint = (path: string) => `https://api-${appId}.sendbird.com/v3${path}`;
  const getHeaders = (headers?: object) => ({ 'Api-Token': apiToken, ...headers });

  return {
    getSessionToken(
      userId: string,
      expires_at = Date.now() + 10 * MIN,
    ): Promise<{ user_id: string; token: string; expires_at: number }> {
      return fetch(endpoint(`/users/${userId}/token`), {
        method: 'post',
        headers: getHeaders(),
        body: JSON.stringify({ expires_at }),
      }).then((res) => res.json());
    },
  };
};

/**
 * API_TOKEN - {@link https://sendbird.com/docs/chat/v3/platform-api/prepare-to-use-api#2-authentication}
 * This is sample code for testing or example.
 * We recommend higher that you use sendbird platform api on your server instead of the client side.
 * */
export const SendbirdAPI = createSendbirdAPI(APP_ID, 'API_TOKEN');

if (__DEV__) {
  const PromiseLogger = Logger.create('debug');
  PromiseLogger.setTitle('[UIKit/promiseUnhandled]');
  const opts = require('react-native/Libraries/promiseRejectionTrackingOptions').default;

  // const originHandler = opts.onUnhandled;
  opts.onUnhandled = (_: number, rejection = { code: undefined }) => {
    PromiseLogger.log(rejection, rejection.code ?? '');
    // originHandler(_, rejection);
  };

  require('promise/setimmediate/rejection-tracking').enable(opts);
}
