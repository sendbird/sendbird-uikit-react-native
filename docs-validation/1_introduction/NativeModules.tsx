import {
  createExpoClipboardService,
  createExpoFileService,
  createExpoMediaService,
  createExpoNotificationService,
  createNativeClipboardService,
  createNativeFileService,
  createNativeMediaService,
  createNativeNotificationService,
} from '@sendbird/uikit-react-native';

/**
 * Helper functions#React Native CLI
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/native-modules#2-helper-functions-3-react-native-cli}
 * */
import Clipboard from '@react-native-clipboard/clipboard';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFBMessaging from '@react-native-firebase/messaging';
import Video from 'react-native-video';
import * as DocumentPicker from 'react-native-document-picker';
import * as FileAccess from 'react-native-file-access';
import * as ImagePicker from 'react-native-image-picker';
import * as Permissions from 'react-native-permissions';
import * as CreateThumbnail from 'react-native-create-thumbnail';
import * as ImageResizer from '@bam.tech/react-native-image-resizer';

const NativeClipboardService = createNativeClipboardService(Clipboard);
const NativeNotificationService = createNativeNotificationService({
  messagingModule: RNFBMessaging,
  permissionModule: Permissions,
});
const NativeFileService = createNativeFileService({
  fsModule: FileAccess,
  permissionModule: Permissions,
  imagePickerModule: ImagePicker,
  mediaLibraryModule: CameraRoll,
  documentPickerModule: DocumentPicker,
});
const NativeMediaService = createNativeMediaService({
  VideoComponent: Video,
  thumbnailModule: CreateThumbnail,
  imageResizerModule: ImageResizer,
});
/** ------------------ **/

/**
 * Helper functions#Expo CLI
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/native-modules#2-helper-functions-3-expo-cli}
 * */
import * as ExpoClipboard from 'expo-clipboard';
import * as ExpoDocumentPicker from 'expo-document-picker';
import * as ExpoFS from 'expo-file-system';
import * as ExpoImagePicker from 'expo-image-picker';
import * as ExpoMediaLibrary from 'expo-media-library';
import * as ExpoNotifications from 'expo-notifications';
import * as ExpoAV from 'expo-av';
import * as ExpoVideoThumbnail from 'expo-video-thumbnails';
import * as ExpoImageManipulator from 'expo-image-manipulator';

const ExpoNotificationService = createExpoNotificationService(ExpoNotifications);
const ExpoClipboardService = createExpoClipboardService(ExpoClipboard);
const ExpoFileService = createExpoFileService({
  fsModule: ExpoFS,
  imagePickerModule: ExpoImagePicker,
  mediaLibraryModule: ExpoMediaLibrary,
  documentPickerModule: ExpoDocumentPicker,
});
const ExpoMediaService = createExpoMediaService({
  avModule: ExpoAV,
  thumbnailModule: ExpoVideoThumbnail,
  imageManipulator: ExpoImageManipulator,
  fsModule: ExpoFS,
})
/** ------------------ **/
