import { Platform } from 'react-native';
import type ImagePicker from 'react-native-image-picker';
import type * as Permissions from 'react-native-permissions';

import fileTypeGuard from '../utils/fileTypeGuard';
import nativePermissionGranted from '../utils/nativePermissionGranted';
import type { FilePickerResponse, FilePickerServiceInterface } from './types';

const createFilePickerServiceNative = (
  pickerModule: typeof ImagePicker,
  permissionModule: typeof Permissions,
): FilePickerServiceInterface => {
  return {
    async hasCameraPermission(): Promise<boolean> {
      const permission: Permissions.Permission[] = Platform.select({
        ios: [permissionModule.PERMISSIONS.IOS.CAMERA],
        android: [permissionModule.PERMISSIONS.ANDROID.CAMERA],
        default: [],
      });
      const status = await permissionModule.checkMultiple(permission);
      return nativePermissionGranted(status);
    },
    async requestCameraPermission(): Promise<boolean> {
      const permission: Permissions.Permission[] = Platform.select({
        ios: [permissionModule.PERMISSIONS.IOS.CAMERA],
        android: [permissionModule.PERMISSIONS.ANDROID.CAMERA],
        default: [],
      });
      const status = await permissionModule.requestMultiple(permission);
      return nativePermissionGranted(status);
    },
    async openCamera(options?: { cameraType?: 'front' | 'back' }): Promise<FilePickerResponse> {
      if (!(await this.hasCameraPermission())) {
        const granted = await this.requestCameraPermission();
        if (!granted) return null;
      }

      const response = await pickerModule.launchCamera({
        cameraType: options?.cameraType ?? 'back',
        mediaType: 'photo',
      });
      if (response.didCancel) return null;
      if (response.errorCode === 'camera_unavailable') return null;

      const { fileName: name, fileSize: size, type, uri } = response.assets?.[0] ?? {};
      return fileTypeGuard({ uri, size, name, type });
    },

    async hasMediaLibraryPermission(): Promise<boolean> {
      const permission: Permissions.Permission[] = Platform.select({
        ios: [permissionModule.PERMISSIONS.IOS.MEDIA_LIBRARY, permissionModule.PERMISSIONS.IOS.PHOTO_LIBRARY],
        android: [
          permissionModule.PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION,
          permissionModule.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ],
        default: [],
      });
      const status = await permissionModule.checkMultiple(permission);
      return nativePermissionGranted(status);
    },
    async requestMediaLibraryPermission(): Promise<boolean> {
      const permission: Permissions.Permission[] = Platform.select({
        ios: [permissionModule.PERMISSIONS.IOS.MEDIA_LIBRARY, permissionModule.PERMISSIONS.IOS.PHOTO_LIBRARY],
        android: [
          permissionModule.PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION,
          permissionModule.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ],
        default: [],
      });
      const status = await permissionModule.requestMultiple(permission);
      return nativePermissionGranted(status);
    },
    async openMediaLibrary(): Promise<FilePickerResponse> {
      if (!(await this.hasMediaLibraryPermission())) {
        const granted = await this.requestMediaLibraryPermission();
        if (!granted) return null;
      }

      const response = await pickerModule.launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
      if (response.didCancel) return null;
      if (response.errorCode === 'camera_unavailable') return null;

      const { fileName: name, fileSize: size, type, uri } = response.assets?.[0] ?? {};
      return fileTypeGuard({ uri, size, name, type });
    },
  };
};

export default createFilePickerServiceNative;
