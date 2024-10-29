import type { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { Platform } from 'react-native';
import type * as DocumentPicker from 'react-native-document-picker';
import type * as FileAccess from 'react-native-file-access';
import type * as ImagePicker from 'react-native-image-picker';
import type * as Permissions from 'react-native-permissions';
import type { Permission } from 'react-native-permissions';

import {
  Logger,
  getFileExtension,
  getFileExtensionFromMime,
  getFileExtensionFromUri,
  getFileType,
  normalizeFileName,
} from '@sendbird/uikit-utils';

import SBUError from '../libs/SBUError';
import nativePermissionGranted from '../utils/nativePermissionGranted';
import normalizeFile from '../utils/normalizeFile';
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
    return [];
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
    android: [],
    default: [],
  });
  const mediaLibraryPermissions: Permission[] = Platform.select({
    ios: [permissionModule.PERMISSIONS.IOS.PHOTO_LIBRARY, permissionModule.PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY],
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
      return normalizeFile({ uri, size, name, type });
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

      return Promise.all(
        (response.assets || [])
          .slice(0, selectionLimit)
          .map(({ fileName: name, fileSize: size, type, uri }) => normalizeFile({ uri, size, name, type })),
      );
    }
    async openDocument(options?: OpenDocumentOptions): Promise<FilePickerResponse> {
      try {
        const { uri, size, name, type } = await documentPickerModule.pickSingle();
        return normalizeFile({ uri, size, name, type });
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

      const { downloadedPath, file } = await this.downloadFile(options);

      if (Platform.OS === 'ios') {
        if (file.type === 'image' || file.type === 'video') {
          const mediaTypeMap = { 'image': 'photo', 'video': 'video' } as const;
          const mediaType = mediaTypeMap[file.type];
          await mediaLibraryModule.save(downloadedPath, { type: mediaType });
        }
      }

      if (Platform.OS === 'android') {
        const externalDirMap = { 'file': 'downloads', 'audio': 'audio', 'image': 'images', 'video': 'video' } as const;
        const externalDir = externalDirMap[file.type];
        await fsModule.FileSystem.cpExternal(downloadedPath, file.name, externalDir).catch(() => {
          Logger.error('Failed to save file to external storage. Retry saving to downloads directory instead.');
          return fsModule.FileSystem.cpExternal(downloadedPath, file.name, 'downloads');
        });
      }

      return downloadedPath;
    }

    private buildDownloadPath = async (options: SaveOptions) => {
      const dirname = Platform.select({ android: fsModule.Dirs.CacheDir, default: fsModule.Dirs.DocumentDir });
      const context = { dirname, filename: options.fileName };
      const extension =
        getFileExtension(options.fileName) ||
        getFileExtensionFromMime(options.fileType) ||
        getFileExtension(options.fileUrl) ||
        (await getFileExtensionFromUri(options.fileUrl));

      if (extension) context.filename = normalizeFileName(context.filename, extension);

      return { path: `${context.dirname}/${context.filename}`, ...context };
    };

    private downloadFile = async (options: SaveOptions) => {
      const { path, filename } = await this.buildDownloadPath(options);
      await fsModule.FileSystem.fetch(options.fileUrl, { path });
      return {
        downloadedPath: path,
        file: {
          name: filename,
          type: getFileType(getFileExtension(path)),
        } as const,
      };
    };

    createRecordFilePath(customExtension = 'm4a'): { recordFilePath: string; uri: string } {
      const filename = `record-${Date.now()}.${customExtension}`;
      const path = `${fsModule.Dirs.CacheDir}/${filename}`;
      return Platform.select({
        ios: {
          uri: path,
          recordFilePath: filename,
        },
        android: {
          uri: path.startsWith('file://') ? path : 'file://' + path,
          recordFilePath: path,
        },
        default: {
          uri: path,
          recordFilePath: path,
        },
      });
    }
  }

  return new NativeFileService();
};

export default createNativeFileService;
