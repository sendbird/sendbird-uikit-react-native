import type { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { Platform } from 'react-native';
import type * as DocumentPicker from 'react-native-document-picker';
import type * as FileAccess from 'react-native-file-access';
import type * as ImagePicker from 'react-native-image-picker';
import type * as Permissions from 'react-native-permissions';
import type { Permission } from 'react-native-permissions';

import { getFileExtension, getFileType, normalizeFileName } from '@sendbird/uikit-utils';

import SBUError from '../libs/SBUError';
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

function getAndroidStoragePermissionsByAPILevel(permissionModule: typeof Permissions): Permission[] {
  if (Platform.OS !== 'android') return [];

  if (Platform.Version > 32) {
    return [
      permissionModule.PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
      permissionModule.PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      permissionModule.PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
    ];
  }

  if (Platform.Version > 28) {
    return [permissionModule.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];
  }

  return [
    permissionModule.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    permissionModule.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  ];
}

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
  fsModule: typeof FileAccess;
}): FileServiceInterface => {
  const cameraPermissions: Permission[] = Platform.select({
    ios: [permissionModule.PERMISSIONS.IOS.CAMERA, permissionModule.PERMISSIONS.IOS.MICROPHONE],
    android: [permissionModule.PERMISSIONS.ANDROID.CAMERA],
    default: [],
  });
  const mediaLibraryPermissions: Permission[] = Platform.select({
    ios: [permissionModule.PERMISSIONS.IOS.MEDIA_LIBRARY, permissionModule.PERMISSIONS.IOS.PHOTO_LIBRARY],
    android: getAndroidStoragePermissionsByAPILevel(permissionModule),
    default: [],
  });

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
      const status = await permissionModule.checkMultiple(mediaLibraryPermissions);
      return nativePermissionGranted(status);
    }
    async requestMediaLibraryPermission(): Promise<boolean> {
      const status = await permissionModule.requestMultiple(mediaLibraryPermissions);
      return nativePermissionGranted(status);
    }

    async openCamera(options?: OpenCameraOptions): Promise<FilePickerResponse> {
      const hasPermission = await this.hasCameraPermission();
      if (!hasPermission) {
        const granted = await this.requestCameraPermission();
        if (!granted) {
          options?.onOpenFailure?.(SBUError.PERMISSIONS_DENIED);
          return null;
        }
      }

      const response = await imagePickerModule.launchCamera({
        presentationStyle: 'fullScreen',
        cameraType: options?.cameraType ?? 'back',
        mediaType: (() => {
          switch (options?.mediaType) {
            case 'photo':
              return 'photo';
            case 'video':
              return 'video';
            case 'all':
              return 'mixed';
            default:
              return 'photo';
          }
        })(),
      });
      if (response.didCancel) return null;
      if (response.errorCode === 'camera_unavailable') {
        options?.onOpenFailure?.(SBUError.DEVICE_UNAVAILABLE, new Error(response.errorMessage));
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
          options?.onOpenFailure?.(SBUError.PERMISSIONS_DENIED);
          return null;
        }
      }

      const response = await imagePickerModule.launchImageLibrary({
        presentationStyle: 'fullScreen',
        selectionLimit,
        mediaType: (() => {
          switch (options?.mediaType) {
            case 'photo':
              return 'photo';
            case 'video':
              return 'video';
            case 'all':
              return 'mixed';
            default:
              return 'photo';
          }
        })(),
      });
      if (response.didCancel) return null;
      if (response.errorCode === 'camera_unavailable') {
        options?.onOpenFailure?.(SBUError.DEVICE_UNAVAILABLE, new Error(response.errorMessage));
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
          options?.onOpenFailure?.(SBUError.UNKNOWN, e);
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
      let downloadPath = `${basePath}/${options.fileName}`;
      if (!getFileExtension(options.fileName)) {
        const extensionFromUrl = getFileExtension(options.fileUrl);
        if (getFileType(extensionFromUrl).match(/image|video/)) {
          downloadPath += extensionFromUrl;
        }
      }

      await fsModule.FileSystem.fetch(options.fileUrl, { path: downloadPath });
      const fileType = getFileType(getFileExtension(options.fileUrl));

      if (Platform.OS === 'ios' && (fileType === 'image' || fileType === 'video')) {
        const type = ({ 'image': 'photo', 'video': 'video' } as const)[fileType];
        await mediaLibraryModule.save(downloadPath, { type });
      }

      if (Platform.OS === 'android') {
        const dirType = { 'file': 'downloads', 'audio': 'audio', 'image': 'images', 'video': 'video' } as const;
        await fsModule.FileSystem.cpExternal(
          downloadPath,
          normalizeFileName(options.fileName, getFileExtension(options.fileUrl)),
          dirType[fileType],
        );
      }
      return downloadPath;
    }
  }

  return new NativeFileService();
};

export default createNativeFileService;
