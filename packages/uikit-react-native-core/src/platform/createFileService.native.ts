import type CameraRoll from '@react-native-community/cameraroll';
import { Platform } from 'react-native';
import type * as DocumentPicker from 'react-native-document-picker';
import type * as RNFS from 'react-native-fs';
import type * as ImagePicker from 'react-native-image-picker';
import type Permissions from 'react-native-permissions';
import type { Permission } from 'react-native-permissions';

import { conditionChaining, getFileExtension, getFileType } from '@sendbird/uikit-utils';

import fileTypeGuard from '../utils/fileTypeGuard';
import nativePermissionGranted from '../utils/nativePermissionGranted';
import type { FilePickerResponse, FileServiceInterface } from './types';

const createNativeFileService = ({
  imagePickerModule,
  documentPickerModule,
  permissionModule,
  mediaLibraryModule,
  fsModule,
}: {
  imagePickerModule: typeof ImagePicker;
  documentPickerModule: typeof DocumentPicker;
  permissionModule: typeof Permissions;
  mediaLibraryModule: typeof CameraRoll;
  fsModule: typeof RNFS;
}): FileServiceInterface => {
  const cameraPermissions: Permission[] = Platform.select({
    ios: [permissionModule.PERMISSIONS.IOS.CAMERA],
    android: [permissionModule.PERMISSIONS.ANDROID.CAMERA],
    default: [],
  });
  const mediaLibraryReadPermissions: Permission[] = Platform.select({
    ios: [permissionModule.PERMISSIONS.IOS.MEDIA_LIBRARY, permissionModule.PERMISSIONS.IOS.PHOTO_LIBRARY],
    android: [permissionModule.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE],
    default: [],
  });
  const mediaLibraryWritePermissions: Permission[] = Platform.select({
    ios: [permissionModule.PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY],
    android: [permissionModule.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE],
    default: [],
  });
  const documentPermissions: Permission[] = Platform.select({
    ios: [],
    android: [permissionModule.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE],
    default: [],
  });

  return {
    async hasCameraPermission(): Promise<boolean> {
      const status = await permissionModule.checkMultiple(cameraPermissions);
      return nativePermissionGranted(status);
    },
    async requestCameraPermission(): Promise<boolean> {
      const status = await permissionModule.requestMultiple(cameraPermissions);
      return nativePermissionGranted(status);
    },
    async openCamera(options): Promise<FilePickerResponse> {
      const hasPermission = await this.hasCameraPermission();
      if (!hasPermission) {
        const granted = await this.requestCameraPermission();
        if (!granted) return null;
      }

      const response = await imagePickerModule.launchCamera({
        cameraType: options?.cameraType ?? 'back',
        mediaType: options?.mediaType ?? 'photo',
      });
      if (response.didCancel) return null;
      if (response.errorCode === 'camera_unavailable') return null;

      const { fileName: name, fileSize: size, type, uri } = response.assets?.[0] ?? {};
      return fileTypeGuard({ uri, size, name, type });
    },

    async hasMediaLibraryPermission(type): Promise<boolean> {
      const status = await permissionModule.checkMultiple(
        conditionChaining(
          [type === 'write', type === 'read'],
          [
            mediaLibraryWritePermissions,
            mediaLibraryReadPermissions,
            mediaLibraryWritePermissions.concat(mediaLibraryReadPermissions),
          ],
        ),
      );
      return nativePermissionGranted(status, () => permissionModule.openLimitedPhotoLibraryPicker());
    },
    async requestMediaLibraryPermission(type): Promise<boolean> {
      const status = await permissionModule.requestMultiple(
        conditionChaining(
          [type === 'write', type === 'read'],
          [
            mediaLibraryWritePermissions,
            mediaLibraryReadPermissions,
            mediaLibraryWritePermissions.concat(mediaLibraryReadPermissions),
          ],
        ),
      );
      return nativePermissionGranted(status);
    },

    /**
     * NOTE: options.selectionLimit {@link https://github.com/react-native-image-picker/react-native-image-picker#options}
     * We do not support 0 (any number of files)
     **/
    async openMediaLibrary(options) {
      const selectionLimit = options?.selectionLimit || 1;
      const hasPermission = await this.hasMediaLibraryPermission('read');
      if (!hasPermission) {
        const granted = await this.requestMediaLibraryPermission('read');
        if (!granted) return null;
      }

      const response = await imagePickerModule.launchImageLibrary({
        mediaType: options?.mediaType ?? 'photo',
        selectionLimit,
      });
      if (response.didCancel) return null;
      if (response.errorCode === 'camera_unavailable') return null;

      return (response.assets || [])
        .slice(0, selectionLimit)
        .map(({ fileName: name, fileSize: size, type, uri }) => fileTypeGuard({ uri, size, name, type }));
    },

    async hasStoragePermission(): Promise<boolean> {
      const status = await permissionModule.checkMultiple(documentPermissions);
      return nativePermissionGranted(status);
    },
    async requestStoragePermission(): Promise<boolean> {
      const status = await permissionModule.requestMultiple(documentPermissions);
      return nativePermissionGranted(status);
    },
    async openDocument(): Promise<FilePickerResponse> {
      const { uri, size, name, type } = await documentPickerModule.pickSingle({});
      return fileTypeGuard({ uri, size, name, type });
    },

    async save(fileUrl: string, fileName: string) {
      const basePath = Platform.select({
        android: fsModule.DownloadDirectoryPath,
        default: fsModule.LibraryDirectoryPath,
      });
      const downloadPath = `${basePath}/${fileName}`;

      const fileType = getFileType(getFileExtension(fileUrl));
      if (fileType.match(/image|video/)) {
        const hasPermission = await this.hasMediaLibraryPermission('write');
        if (!hasPermission) {
          const granted = await this.requestMediaLibraryPermission('write');
          if (!granted) throw new Error('Permission not granted');
        }

        await fsModule.downloadFile({ fromUrl: fileUrl, toFile: downloadPath }).promise;
        await mediaLibraryModule.save(downloadPath);
      } else {
        await fsModule.downloadFile({ fromUrl: fileUrl, toFile: downloadPath }).promise;
      }

      return downloadPath;
    },
  };
};

export default createNativeFileService;
