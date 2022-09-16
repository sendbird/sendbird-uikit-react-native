import type * as ExpoDocumentPicker from 'expo-document-picker';
import type * as ExpoFs from 'expo-file-system';
import type * as ExpoImagePicker from 'expo-image-picker';
import type * as ExpoMediaLibrary from 'expo-media-library';

import { getFileExtension, getFileType } from '@sendbird/uikit-utils';

import SBUError from '../libs/SBUError';
import type { ExpoMediaLibraryPermissionResponse, ExpoPermissionResponse } from '../utils/expoPermissionGranted';
import expoPermissionGranted from '../utils/expoPermissionGranted';
import fileTypeGuard from '../utils/fileTypeGuard';
import type {
  FilePickerResponse,
  FileServiceInterface,
  OpenCameraOptions,
  OpenDocumentOptions,
  OpenMediaLibraryOptions,
  SaveOptions,
} from './types';

const createExpoFileService = ({
  imagePickerModule,
  documentPickerModule,
  mediaLibraryModule,
  fsModule,
}: {
  imagePickerModule: typeof ExpoImagePicker;
  documentPickerModule: typeof ExpoDocumentPicker;
  mediaLibraryModule: typeof ExpoMediaLibrary;
  fsModule: typeof ExpoFs;
}): FileServiceInterface => {
  class ExpoFileServiceInterface implements FileServiceInterface {
    async hasCameraPermission(): Promise<boolean> {
      const res = (await imagePickerModule.getCameraPermissionsAsync()) as ExpoPermissionResponse;
      return expoPermissionGranted([res]);
    }
    async requestCameraPermission(): Promise<boolean> {
      const res = (await imagePickerModule.requestCameraPermissionsAsync()) as ExpoPermissionResponse;
      return expoPermissionGranted([res]);
    }
    async hasMediaLibraryPermission(type: 'write' | 'read'): Promise<boolean> {
      const perms = (await mediaLibraryModule.getPermissionsAsync(
        type === 'write',
      )) as ExpoMediaLibraryPermissionResponse;
      return expoPermissionGranted([perms]);
    }
    async requestMediaLibraryPermission(type: 'write' | 'read'): Promise<boolean> {
      const perms = (await mediaLibraryModule.requestPermissionsAsync(
        type === 'write',
      )) as ExpoMediaLibraryPermissionResponse;
      return expoPermissionGranted([perms]);
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

      const response = await imagePickerModule.launchCameraAsync({
        mediaTypes: (() => {
          switch (options?.mediaType) {
            case 'photo':
              return imagePickerModule.MediaTypeOptions.Images;
            case 'video':
              return imagePickerModule.MediaTypeOptions.Videos;
            case 'all':
              return imagePickerModule.MediaTypeOptions.All;
            default:
              return imagePickerModule.MediaTypeOptions.Images;
          }
        })(),
      });

      if (response.cancelled) return null;

      const { uri } = response;
      const { size } = await fsModule.getInfoAsync(response.uri);
      const ext = getFileExtension(uri);
      const type = getFileType(ext);

      return fileTypeGuard({ uri, size, type: `${type}/${ext.slice(1)}`, name: Date.now() + ext });
    }
    async openMediaLibrary(options: OpenMediaLibraryOptions) {
      const hasPermission = await this.hasMediaLibraryPermission('read');
      if (!hasPermission) {
        const granted = await this.requestMediaLibraryPermission('read');
        if (!granted) {
          options?.onOpenFailure?.(SBUError.PERMISSIONS_DENIED);
          return null;
        }
      }

      const response = await imagePickerModule.launchImageLibraryAsync({
        mediaTypes: (() => {
          switch (options?.mediaType) {
            case 'photo':
              return imagePickerModule.MediaTypeOptions.Images;
            case 'video':
              return imagePickerModule.MediaTypeOptions.Videos;
            case 'all':
              return imagePickerModule.MediaTypeOptions.All;
            default:
              return imagePickerModule.MediaTypeOptions.Images;
          }
        })(),
      });
      if (response.cancelled) return null;
      const { uri } = response;

      const { size } = await fsModule.getInfoAsync(uri);
      const ext = getFileExtension(uri);
      const type = getFileType(ext);
      return [fileTypeGuard({ uri, size, type: `${type}/${ext.slice(1)}`, name: Date.now() + ext })];
    }

    async openDocument(options?: OpenDocumentOptions): Promise<FilePickerResponse> {
      try {
        const response = await documentPickerModule.getDocumentAsync({ type: '*/*' });
        if (response.type === 'cancel') return null;
        const { mimeType, uri, size, name } = response;
        return fileTypeGuard({ uri, size, name, type: mimeType });
      } catch (e) {
        options?.onOpenFailure?.(SBUError.UNKNOWN, e);
        return null;
      }
    }

    async save(options: SaveOptions): Promise<string> {
      const hasPermission = await this.hasMediaLibraryPermission('write');
      if (!hasPermission) {
        const granted = await this.requestMediaLibraryPermission('write');
        if (!granted) throw new Error('Permission not granted');
      }

      const basePath = fsModule.documentDirectory || fsModule.cacheDirectory;
      if (!basePath) throw new Error('Cannot determine directory');

      const downloadPath = `${basePath}/${options.fileName}`;

      const response = await fsModule.downloadAsync(options.fileUrl, downloadPath);
      if (getFileType(options.fileType || '').match(/video|image/)) {
        await mediaLibraryModule.saveToLibraryAsync(response.uri);
      }
      return response.uri;
    }
  }

  return new ExpoFileServiceInterface();
};

export default createExpoFileService;
