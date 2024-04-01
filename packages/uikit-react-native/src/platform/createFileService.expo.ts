import type * as ExpoDocumentPicker from 'expo-document-picker';
import type * as ExpoFs from 'expo-file-system';
import type * as ExpoImagePicker from 'expo-image-picker';
import type * as ExpoMediaLibrary from 'expo-media-library';

import { getFileType } from '@sendbird/uikit-utils';

import SBUError from '../libs/SBUError';
import expoBackwardUtils from '../utils/expoBackwardUtils';
import type { ExpoMediaLibraryPermissionResponse, ExpoPermissionResponse } from '../utils/expoPermissionGranted';
import expoPermissionGranted from '../utils/expoPermissionGranted';
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
      const perms = (await imagePickerModule.getMediaLibraryPermissionsAsync(
        type === 'write',
      )) as ExpoMediaLibraryPermissionResponse;
      return expoPermissionGranted([perms]);
    }
    async requestMediaLibraryPermission(type: 'write' | 'read'): Promise<boolean> {
      const perms = (await imagePickerModule.requestMediaLibraryPermissionsAsync(
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

      if (expoBackwardUtils.imagePicker.isCanceled(response)) return null;

      const [file] = await expoBackwardUtils.imagePicker.toFilePickerResponses(response, fsModule);
      return file;
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

      const selectionLimit = options?.selectionLimit || 1;
      const response = await imagePickerModule.launchImageLibraryAsync({
        selectionLimit,
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
      if (expoBackwardUtils.imagePicker.isCanceled(response)) return null;
      return expoBackwardUtils.imagePicker.toFilePickerResponses(response, fsModule);
    }

    async openDocument(options?: OpenDocumentOptions): Promise<FilePickerResponse> {
      try {
        const response = await documentPickerModule.getDocumentAsync({ type: '*/*' });
        if (expoBackwardUtils.documentPicker.isCanceled(response)) return null;

        const [file] = await expoBackwardUtils.documentPicker.toFilePickerResponses(response);
        return file;
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
    createRecordFilePath(customExtension = 'm4a'): { recordFilePath: string; uri: string } {
      const basePath = fsModule.cacheDirectory;
      if (!basePath) throw new Error('Cannot determine directory');

      const filename = `record-${Date.now()}.${customExtension}`;
      return {
        uri: `${basePath}/${filename}`,
        recordFilePath: `${basePath}/${filename}`,
      };
    }
  }

  return new ExpoFileServiceInterface();
};

export default createExpoFileService;
