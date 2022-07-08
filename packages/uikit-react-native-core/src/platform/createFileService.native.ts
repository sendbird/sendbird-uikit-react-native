import type CameraRoll from '@react-native-community/cameraroll';
import { Platform } from 'react-native';
import type * as DeviceInfo from 'react-native-device-info';
import type * as DocumentPicker from 'react-native-document-picker';
import type * as FileAccess from 'react-native-file-access';
import type * as ImagePicker from 'react-native-image-picker';
import type * as Permissions from 'react-native-permissions';
import type { Permission } from 'react-native-permissions';

import { getFileExtension, getFileType } from '@sendbird/uikit-utils';

import fileTypeGuard from '../utils/fileTypeGuard';
import nativePermissionGranted from '../utils/nativePermissionGranted';
import type {
  FilePickerResponse,
  FileServiceInterface,
  OpenCameraOptions,
  OpenDocumentOptions,
  OpenMediaLibraryOptions,
  SaveOptions,
} from './types';

const createNativeFileService = ({
  imagePickerModule,
  documentPickerModule,
  permissionModule,
  mediaLibraryModule,
  fsModule,
  deviceInfoModule,
}: {
  imagePickerModule: typeof ImagePicker;
  documentPickerModule: typeof DocumentPicker;
  permissionModule: typeof Permissions;
  mediaLibraryModule: typeof CameraRoll;
  fsModule: typeof FileAccess;
  deviceInfoModule: typeof DeviceInfo;
}): FileServiceInterface => {
  const cameraPermissions: Permission[] = Platform.select({
    ios: [permissionModule.PERMISSIONS.IOS.CAMERA],
    android: [permissionModule.PERMISSIONS.ANDROID.CAMERA],
    default: [],
  });
  const mediaLibraryPermissionsLegacy: Permission[] = Platform.select({
    ios: [permissionModule.PERMISSIONS.IOS.MEDIA_LIBRARY, permissionModule.PERMISSIONS.IOS.PHOTO_LIBRARY],
    android: [
      permissionModule.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      permissionModule.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ],
    default: [],
  });
  const mediaLibraryPermissions: Permission[] = Platform.select({
    ios: [permissionModule.PERMISSIONS.IOS.MEDIA_LIBRARY, permissionModule.PERMISSIONS.IOS.PHOTO_LIBRARY],
    android: [permissionModule.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE],
    default: [],
  });
  deviceInfoModule.getApiLevel();

  class NativeFileService implements FileServiceInterface {
    async hasCameraPermission(): Promise<boolean> {
      const status = await permissionModule.checkMultiple(cameraPermissions);
      return nativePermissionGranted(status);
    }
    async requestCameraPermission(): Promise<boolean> {
      const status = await permissionModule.requestMultiple(cameraPermissions);
      return nativePermissionGranted(status);
    }
    async hasMediaLibraryPermission(): Promise<boolean> {
      if (Platform.OS !== 'android' || (await deviceInfoModule.getApiLevel()) > 28) {
        const status = await permissionModule.checkMultiple(mediaLibraryPermissions);
        return nativePermissionGranted(status);
      } else {
        const status = await permissionModule.checkMultiple(mediaLibraryPermissionsLegacy);
        return nativePermissionGranted(status);
      }
    }
    async requestMediaLibraryPermission(): Promise<boolean> {
      if (Platform.OS !== 'android' || (await deviceInfoModule.getApiLevel()) > 28) {
        const status = await permissionModule.requestMultiple(mediaLibraryPermissions);
        return nativePermissionGranted(status);
      } else {
        const status = await permissionModule.checkMultiple(mediaLibraryPermissionsLegacy);
        return nativePermissionGranted(status);
      }
    }

    async openCamera(options?: OpenCameraOptions): Promise<FilePickerResponse> {
      const hasPermission = await this.hasCameraPermission();
      if (!hasPermission) {
        const granted = await this.requestCameraPermission();
        if (!granted) {
          options?.onOpenFailureWithToastMessage?.();
          return null;
        }
      }

      const response = await imagePickerModule.launchCamera({
        cameraType: options?.cameraType ?? 'back',
        mediaType: options?.mediaType ?? 'photo',
      });
      if (response.didCancel) return null;
      if (response.errorCode === 'camera_unavailable') {
        options?.onOpenFailureWithToastMessage?.();
        return null;
      }

      const { fileName: name, fileSize: size, type, uri } = response.assets?.[0] ?? {};
      return fileTypeGuard({ uri, size, name, type });
    }
    async openMediaLibrary(options?: OpenMediaLibraryOptions): Promise<FilePickerResponse[] | null> {
      /**
       * NOTE: options.selectionLimit {@link https://github.com/react-native-image-picker/react-native-image-picker#options}
       * We do not support 0 (any number of files)
       **/
      const selectionLimit = options?.selectionLimit || 1;
      const hasPermission = await this.hasMediaLibraryPermission();
      if (!hasPermission) {
        const granted = await this.requestMediaLibraryPermission();
        if (!granted) {
          options?.onOpenFailureWithToastMessage?.();
          return null;
        }
      }

      const response = await imagePickerModule.launchImageLibrary({
        mediaType: options?.mediaType ?? 'photo',
        selectionLimit,
      });
      if (response.didCancel) return null;
      if (response.errorCode === 'camera_unavailable') {
        options?.onOpenFailureWithToastMessage?.();
        return null;
      }

      return (response.assets || [])
        .slice(0, selectionLimit)
        .map(({ fileName: name, fileSize: size, type, uri }) => fileTypeGuard({ uri, size, name, type }));
    }
    async openDocument(options?: OpenDocumentOptions): Promise<FilePickerResponse> {
      try {
        const { uri, size, name, type } = await documentPickerModule.pickSingle();
        return fileTypeGuard({ uri, size, name, type });
      } catch (e) {
        if (!documentPickerModule.isCancel(e) && documentPickerModule.isInProgress(e)) {
          options?.onOpenFailureWithToastMessage?.();
        }
        return null;
      }
    }
    async save(options: SaveOptions): Promise<string> {
      const hasPermission = await this.hasMediaLibraryPermission();
      if (!hasPermission) {
        const granted = await this.requestMediaLibraryPermission();
        if (!granted) throw new Error('Permission not granted');
      }

      const basePath = Platform.select({ android: fsModule.Dirs.CacheDir, default: fsModule.Dirs.DocumentDir });
      const downloadPath = `${basePath}/${options.fileName}`;

      await fsModule.FileSystem.fetch(options.fileUrl, { path: downloadPath });

      const fileType = getFileType(getFileExtension(options.fileUrl));

      if (Platform.OS === 'ios' && fileType.match(/audio|video/)) {
        await mediaLibraryModule.save(downloadPath);
      }
      if (Platform.OS === 'android') {
        const dirType = { 'file': 'downloads', 'audio': 'audio', 'image': 'images', 'video': 'video' } as const;
        await fsModule.FileSystem.cpExternal(downloadPath, options.fileName, dirType[fileType]);
      }
      return downloadPath;
    }
  }

  return new NativeFileService();
};

export default createNativeFileService;
