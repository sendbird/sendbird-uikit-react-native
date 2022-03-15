import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, StatusBar } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions';
import SendBird from 'sendbird';

import { NotificationServiceInterface, createFilePickerServiceNative } from '@sendbird/uikit-react-native-core';
import type { SendbirdChatSDK } from '@sendbird/uikit-utils';

import { APP_ID } from '../env';

export const SendBirdInstance = new SendBird({ appId: APP_ID }) as SendbirdChatSDK;
export const FilePickerService = createFilePickerServiceNative(ImagePicker, Permissions);
export const NotificationService = {} as NotificationServiceInterface;
export const RootStack = createNativeStackNavigator();
export const GetTranslucent = (state = true) => {
  Platform.OS === 'android' && StatusBar.setTranslucent(state);
  return Platform.select({ ios: state, android: state });
};
