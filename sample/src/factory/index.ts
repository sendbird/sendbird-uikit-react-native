import AsyncStorageLib from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, StatusBar } from 'react-native';
import * as DocumentPicker from 'react-native-document-picker';
import * as ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions';
import SendBird from 'sendbird';

import { NotificationServiceInterface, createFilePickerServiceNative } from '@sendbird/uikit-react-native-core';
import type { SendbirdChatSDK } from '@sendbird/uikit-utils';
import { Logger } from '@sendbird/uikit-utils';

import { APP_ID } from '../env';

const ENABLE_LOCAL_CACHE = true;
export const SendBirdInstance = new SendBird({
  appId: APP_ID,
  localCacheEnabled: ENABLE_LOCAL_CACHE,
}) as SendbirdChatSDK;
if (ENABLE_LOCAL_CACHE) SendBirdInstance.useAsyncStorageAsDatabase(AsyncStorageLib);

export const RootStack = createNativeStackNavigator();
export const FilePickerService = createFilePickerServiceNative(ImagePicker, DocumentPicker, Permissions);
export const NotificationService = {} as NotificationServiceInterface;

export const GetTranslucent = (state = true) => {
  Platform.OS === 'android' && StatusBar.setTranslucent(state);
  return Platform.select({ ios: state, android: state });
};

if (__DEV__) {
  const PromiseLogger = Logger.create('debug');
  PromiseLogger.setTitle('[UIKit/promiseUnhandledHandler]');
  const opts = require('react-native/Libraries/promiseRejectionTrackingOptions').default;

  // const originHandler = opts.onUnhandled;
  opts.onUnhandled = (_: number, rejection = { code: undefined }) => {
    PromiseLogger.log(rejection, rejection.code ?? '');
    // originHandler(_, rejection);
  };

  require('promise/setimmediate/rejection-tracking').enable(opts);
}
